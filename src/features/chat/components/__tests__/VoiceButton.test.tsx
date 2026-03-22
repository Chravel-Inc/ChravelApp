import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { VoiceButton } from '../VoiceButton';

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('VoiceButton', () => {
  it('uses 36px minimum sizing for compact composer mode', () => {
    render(<VoiceButton voiceState="idle" isEligible={true} onToggle={vi.fn()} small />);

    const button = screen.getByRole('button', { name: 'Tap to dictate' });
    expect(button.className).toContain('size-9');
    expect(button.className).toContain('min-w-[36px]');
    expect(button.className).not.toContain('size-8');
  });
});
