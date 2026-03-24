import { beforeEach, describe, expect, it, vi } from 'vitest';
import { paymentService } from '../paymentService';
import { supabase } from '@/integrations/supabase/client';

type QueryResponse<T = unknown> = {
  data: T;
  error: { message?: string } | null;
  count?: number | null;
};

type ChainableQuery<T = unknown> = {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  then: (onFulfilled?: (value: QueryResponse<T>) => unknown) => Promise<unknown>;
};

function createChainableMock<T>(response: QueryResponse<T>, withUpdate = false): ChainableQuery<T> {
  const chain = {
    select: vi.fn(),
    eq: vi.fn(),
    update: vi.fn(),
    then: (onFulfilled?: (value: QueryResponse<T>) => unknown) =>
      Promise.resolve(response).then(onFulfilled),
  } as ChainableQuery<T>;

  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  if (withUpdate) {
    chain.update.mockReturnValue(chain);
  }

  return chain;
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('paymentService.updateParentPaymentSettledStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps parent payment unsettled when any unsettled splits remain', async () => {
    const unsettledCountQuery = createChainableMock({
      data: null,
      count: 3,
      error: null,
    });
    const updateQuery = createChainableMock(
      {
        data: null,
        error: null,
      },
      true,
    );

    vi.mocked(supabase.from).mockImplementation(((table: string) => {
      if (table === 'payment_splits') return unsettledCountQuery;
      if (table === 'trip_payment_messages') return updateQuery;
      return createChainableMock({ data: null, error: null });
    }) as any);

    await paymentService.updateParentPaymentSettledStatus('payment-123');

    expect(unsettledCountQuery.select).toHaveBeenCalledWith('id', { count: 'exact', head: true });
    expect(unsettledCountQuery.eq).toHaveBeenNthCalledWith(1, 'payment_message_id', 'payment-123');
    expect(unsettledCountQuery.eq).toHaveBeenNthCalledWith(2, 'is_settled', false);
    expect(updateQuery.update).toHaveBeenCalledWith({ is_settled: false });
    expect(updateQuery.eq).toHaveBeenCalledWith('id', 'payment-123');
  });

  it('marks parent payment settled when unsettled count is zero', async () => {
    const unsettledCountQuery = createChainableMock({
      data: null,
      count: 0,
      error: null,
    });
    const updateQuery = createChainableMock(
      {
        data: null,
        error: null,
      },
      true,
    );

    vi.mocked(supabase.from).mockImplementation(((table: string) => {
      if (table === 'payment_splits') return unsettledCountQuery;
      if (table === 'trip_payment_messages') return updateQuery;
      return createChainableMock({ data: null, error: null });
    }) as any);

    await paymentService.updateParentPaymentSettledStatus('payment-456');

    expect(updateQuery.update).toHaveBeenCalledWith({ is_settled: true });
    expect(updateQuery.eq).toHaveBeenCalledWith('id', 'payment-456');
  });
});
