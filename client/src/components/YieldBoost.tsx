import { Header } from './Header';
import { YieldBoostCard } from './YieldBoostCard';
import { useYieldBoost } from '@/hooks/useYieldBoost';
import {useAccount} from "wagmi";
import {appConfig} from "@/config.ts";

export default function YieldBoost() {
  const {
    amount,
    setAmount,
    availableBalance,
    boostedAmount,
    previewAmount,
    handleBoostYield,
    handleWithdraw,
    setActiveTab,
    currentAPY,
    vaultData,
    inProgress,
    activeTab
  } = useYieldBoost();

  const {connector} = useAccount();

  const onAddClick = async () => {
    try {
      if(!connector) {
        return
      }
      const provider = await connector.getProvider() as any
      const wasAdded = await provider
        .request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: appConfig.stakingVaultAddress,
              symbol: 'boostDAI',
              decimals: 18,
              image: "",
            },
          },
        })

      if (wasAdded) {
        console.log("Token was added")
      } else {
        console.log("Token wasn't added to Metamask")
      }
    } catch (e) {
      console.error('Failed to add token to Metamask:', e);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col items-center">
        {/*<h1 className="text-4xl font-bold text-center mb-8">Simple. DeFi.</h1>*/}

        <div className="w-full max-w-xl mx-auto">
          <YieldBoostCard
            availableBalance={availableBalance}
            boostedAmount={boostedAmount}
            amount={amount}
            onAmountChange={setAmount}
            onMaxClick={() => setAmount(availableBalance.toString())}
            onBoost={handleBoostYield}
            onWithdraw={handleWithdraw}
            previewAmount={previewAmount}
            currentAPY={currentAPY}
            onTabChange={setActiveTab}
            vaultData={vaultData}
            inProgress={inProgress}
            activeTab={activeTab}
          />

          <p className="text-sm text-center text-gray-400 mt-4">
            *0.1% fee for deposits and withdrawals
          </p>
        </div>
        {connector &&
            <div
                onClick={onAddClick}
                style={{
                  cursor: 'pointer',
                  marginTop: '2px',
                  borderBottom: '1px solid #dddddd'
            }}
            >
                Add boostDAI to MetaMask
            </div>
        }
      </div>
    </div>
  );
}
