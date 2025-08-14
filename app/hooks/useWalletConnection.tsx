import { useState, useEffect, useCallback } from 'react';
import { chains } from '@chain-registry/v2';

export interface ConnectionStatus {
  chainName: string;
  status: 'connected' | 'connecting' | 'failed' | 'disconnected';
  address?: string;
  walletName?: string;
  error?: string;
}

export interface ConnectionSummary {
  totalChains: number;
  connectedChains: number;
  connectingChains: number;
  failedChains: number;
  disconnectedChains: number;
}

export interface ConnectionResult {
  success: number;
  failed: number;
}

export const useWalletConnection = () => {
  const [connectionStatuses, setConnectionStatuses] = useState<
    ConnectionStatus[]
  >([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize connection statuses for all chains
  useEffect(() => {
    const initialStatuses: ConnectionStatus[] = chains.map((chain) => ({
      chainName: chain.chainName,
      status: 'disconnected',
    }));
    setConnectionStatuses(initialStatuses);
  }, []);

  const updateConnectionStatus = useCallback(
    (chainName: string, status: Partial<ConnectionStatus>) => {
      setConnectionStatuses((prev) =>
        prev.map((s) => (s.chainName === chainName ? { ...s, ...status } : s))
      );
    },
    []
  );

  const getConnectionSummary = useCallback((): ConnectionSummary => {
    const total = connectionStatuses.length;
    const connected = connectionStatuses.filter(
      (s) => s.status === 'connected'
    ).length;
    const connecting = connectionStatuses.filter(
      (s) => s.status === 'connecting'
    ).length;
    const failed = connectionStatuses.filter(
      (s) => s.status === 'failed'
    ).length;
    const disconnected = connectionStatuses.filter(
      (s) => s.status === 'disconnected'
    ).length;

    return {
      totalChains: total,
      connectedChains: connected,
      connectingChains: connecting,
      failedChains: failed,
      disconnectedChains: disconnected,
    };
  }, [connectionStatuses]);

  const connectSingleChain = useCallback(
    async (chainName: string): Promise<void> => {
      updateConnectionStatus(chainName, { status: 'connecting' });

      try {
        // Simulate connection process - in real implementation, this would use the actual wallet connection
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 2000)
        );

        // Simulate success/failure
        const success = Math.random() > 0.3; // 70% success rate

        if (success) {
          updateConnectionStatus(chainName, {
            status: 'connected',
            address: `cosmos${Math.random().toString(36).substring(2, 15)}`,
            walletName: 'keplr-extension',
          });
        } else {
          updateConnectionStatus(chainName, {
            status: 'failed',
            error: 'Connection failed. Please try again.',
          });
        }
      } catch (error) {
        updateConnectionStatus(chainName, {
          status: 'failed',
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    },
    [updateConnectionStatus]
  );

  const disconnectSingleChain = useCallback(
    async (chainName: string): Promise<void> => {
      updateConnectionStatus(chainName, { status: 'disconnected' });
    },
    [updateConnectionStatus]
  );

  const connectAll = useCallback(async (): Promise<ConnectionResult | null> => {
    if (isConnecting) return null;

    setIsConnecting(true);
    const disconnectedChains = connectionStatuses.filter(
      (s) => s.status === 'disconnected'
    );

    try {
      const results = await Promise.allSettled(
        disconnectedChains.map((chain) => connectSingleChain(chain.chainName))
      );

      const success = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      return { success, failed };
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, connectionStatuses, connectSingleChain]);

  const disconnectAll = useCallback(async (): Promise<void> => {
    const connectedChains = connectionStatuses.filter(
      (s) => s.status === 'connected'
    );

    await Promise.all(
      connectedChains.map((chain) => disconnectSingleChain(chain.chainName))
    );
  }, [connectionStatuses, disconnectSingleChain]);

  const retryFailed =
    useCallback(async (): Promise<ConnectionResult | null> => {
      if (isConnecting) return null;

      setIsConnecting(true);
      const failedChains = connectionStatuses.filter(
        (s) => s.status === 'failed'
      );

      try {
        const results = await Promise.allSettled(
          failedChains.map((chain) => connectSingleChain(chain.chainName))
        );

        const success = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        return { success, failed };
      } finally {
        setIsConnecting(false);
      }
    }, [isConnecting, connectionStatuses, connectSingleChain]);

  const summary = getConnectionSummary();

  return {
    connectionStatuses,
    isConnecting,
    summary,
    connectAll,
    disconnectAll,
    retryFailed,
    connectSingleChain,
    disconnectSingleChain,
  };
};
