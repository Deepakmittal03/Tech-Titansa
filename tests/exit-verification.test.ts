import { describe, it, expect, beforeEach } from 'vitest';
import { DataStore } from '@/lib/data-store';

describe('Smart Exit Verification Gate Engine', () => {
  beforeEach(() => {
    // Reset DataStore state if needed
  });

  it('should successfully verify a valid, unburned single-use exit pass', () => {
    const validToken = 'PENGO-EXIT-SECURE-9842-B4K9';
    const result = DataStore.verifyExitPass(validToken, 'Officer Test');

    expect(result.success).toBe(true);
    expect(result.order).toBeDefined();
    expect(result.exitPass).toBeDefined();
    expect(result.exitPass?.is_used).toBe(true);
    expect(result.exitPass?.verified_by).toBe('Officer Test');
  });

  it('should deny exit and flag duplicate presentation for an already burned pass', () => {
    const alreadyUsedToken = 'PENGO-EXIT-SECURE-9841-A8F1';
    const result = DataStore.verifyExitPass(alreadyUsedToken, 'Officer Test');

    expect(result.success).toBe(false);
    expect(result.riskStatus).toBe('already_used');
    expect(result.message).toContain('ALREADY USED');
  });

  it('should deny exit for tampered or fake pass tokens and log a security incident', () => {
    const fakeToken = 'MALICIOUS-TOKEN-9999-TAMPER';
    const result = DataStore.verifyExitPass(fakeToken, 'Officer Test');

    expect(result.success).toBe(false);
    expect(result.riskStatus).toBe('invalid_token');
    expect(result.message).toContain('Invalid');

    // Confirm fraud alert was recorded
    const alerts = DataStore.getFraudAlerts();
    const alert = alerts.find((a) => a.description.includes(fakeToken));
    expect(alert).toBeDefined();
    expect(alert?.risk_level).toBe('high');
  });

  it('should atomically burn the token after the first successful verification', () => {
    // Simulate a fresh checkout to get an unburned token
    const checkout = DataStore.simulateCustomerCheckout();
    expect(checkout).not.toBeNull();
    const token = checkout!.token;

    // First attempt: Must succeed
    const firstAttempt = DataStore.verifyExitPass(token, 'Gate A1');
    expect(firstAttempt.success).toBe(true);

    // Immediate second attempt with same token: Must be blocked as duplicate
    const secondAttempt = DataStore.verifyExitPass(token, 'Gate A1');
    expect(secondAttempt.success).toBe(false);
    expect(secondAttempt.riskStatus).toBe('already_used');
  });
});
