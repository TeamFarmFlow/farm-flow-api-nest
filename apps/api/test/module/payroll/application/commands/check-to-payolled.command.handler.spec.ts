import { DataSource, EntityManager } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckToPayrolledCommandHandler, PayrollAttendanceRepositoryPort, PayrollFarmUserRepositoryPort, PayrollRepositoryPort } from '@apps/api/payroll/application';
import { PayrollMemberNotFoundException } from '@apps/api/payroll/domain';

describe('CheckToPayrolledCommandHandler', () => {
  let dataSource: DataSource;
  let entityManager: EntityManager;
  let payrollRepository: PayrollRepositoryPort;
  let payrollFarmUserRepository: PayrollFarmUserRepositoryPort;
  let payrollAttendanceRepository: PayrollAttendanceRepositoryPort;
  let handler: CheckToPayrolledCommandHandler;

  beforeEach(() => {
    entityManager = {} as EntityManager;
    dataSource = {
      transaction: vi.fn().mockImplementation(async (callback: (em: EntityManager) => Promise<void>) => callback(entityManager)),
    } as unknown as DataSource;
    payrollRepository = {
      insert: vi.fn(),
    };
    payrollFarmUserRepository = {
      findOne: vi.fn(),
    };
    payrollAttendanceRepository = {
      findPayrollTargetsByFarmIdAndDateRange: vi.fn(),
      findPayrollTargetsByFarmIdAndUserIdAndDateRange: vi.fn(),
      findUnpayrolledByFarmIdAndUserIdAndDateRange: vi.fn(),
      update: vi.fn(),
      updatePayrolled: vi.fn(),
      delete: vi.fn(),
    };

    handler = new CheckToPayrolledCommandHandler(dataSource, payrollRepository, payrollFarmUserRepository, payrollAttendanceRepository);
  });

  it('급여 대상 farm user가 없으면 PayrollMemberNotFoundException를 던진다.', async () => {
    payrollFarmUserRepository.findOne = vi.fn().mockResolvedValue(null);

    await expect(
      handler.execute({
        farmId: 'farm-1',
        userId: 'user-1',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
      }),
    ).rejects.toBeInstanceOf(PayrollMemberNotFoundException);

    expect(payrollAttendanceRepository.findUnpayrolledByFarmIdAndUserIdAndDateRange).not.toHaveBeenCalled();
    expect(dataSource.transaction).not.toHaveBeenCalled();
    expect(payrollRepository.insert).not.toHaveBeenCalled();
  });

  it('미정산 attendance를 payrolled 처리하고 payroll을 저장한다.', async () => {
    payrollFarmUserRepository.findOne = vi.fn().mockResolvedValue({
      payRatePerHour: 10000,
      payDeductionAmount: 3000,
    });
    payrollAttendanceRepository.findUnpayrolledByFarmIdAndUserIdAndDateRange = vi.fn().mockResolvedValue([
      { id: 'attendance-1', seconds: 3600 },
      { id: 'attendance-2', seconds: 1800 },
    ]);
    payrollAttendanceRepository.updatePayrolled = vi.fn().mockResolvedValueOnce({ seconds: 3600 }).mockResolvedValueOnce({ seconds: 1800 });
    payrollRepository.insert = vi.fn().mockResolvedValue(undefined);

    await handler.execute({
      farmId: 'farm-1',
      userId: 'user-1',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    });

    expect(payrollAttendanceRepository.findUnpayrolledByFarmIdAndUserIdAndDateRange).toHaveBeenCalledWith('farm-1', 'user-1', '2026-03-01', '2026-03-07');
    expect(dataSource.transaction).toHaveBeenCalledOnce();
    expect(payrollAttendanceRepository.updatePayrolled).toHaveBeenNthCalledWith(1, 'attendance-1', entityManager);
    expect(payrollAttendanceRepository.updatePayrolled).toHaveBeenNthCalledWith(2, 'attendance-2', entityManager);
    expect(payrollRepository.insert).toHaveBeenCalledWith(
      {
        farmId: 'farm-1',
        userId: 'user-1',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        totalSeconds: 5400,
        totalPaymentAmount: 15000,
        totalDeductionAmount: 3000,
      },
      entityManager,
    );
  });
});
