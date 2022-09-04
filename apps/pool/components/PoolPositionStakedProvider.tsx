import { Amount, Token } from '@sushiswap/currency'
import { Chef, useMasterChef } from '@sushiswap/wagmi'
import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

import { Pair } from '../.graphclient'
import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../lib/hooks'
import { usePoolFarmRewards } from './PoolFarmRewardsProvider'

interface PoolPositionStakedContext {
  balance: Amount<Token> | undefined
  value0: number | undefined
  value1: number | undefined
  underlying0: Amount<Token> | undefined
  underlying1: Amount<Token> | undefined
  isLoading: boolean
  isError: boolean
  withdraw: ((amount: Amount<Token> | undefined) => void) | undefined
  deposit: ((amount: Amount<Token> | undefined) => void) | undefined
  isWritePending: boolean
  isWriteError: boolean
}

const Context = createContext<PoolPositionStakedContext | undefined>(undefined)

interface PoolPositionStakedProviderProps {
  pair: Pair
  children: ReactNode
}

export const PoolPositionStakedProvider: FC<PoolPositionStakedProviderProps> = ({ pair, children }) => {
  const { farmId, chefType } = usePoolFarmRewards()

  if (farmId === undefined || !chefType)
    return (
      <Context.Provider
        value={{
          balance: undefined,
          value0: undefined,
          value1: undefined,
          underlying0: undefined,
          underlying1: undefined,
          isLoading: false,
          isError: false,
          withdraw: undefined,
          deposit: undefined,
          isWriteError: false,
          isWritePending: false,
        }}
      >
        {children}
      </Context.Provider>
    )

  return (
    <_PoolPositionStakedProvider pair={pair} farmId={farmId} chefType={chefType}>
      {children}
    </_PoolPositionStakedProvider>
  )
}

interface _PoolPositionStakedProviderProps {
  pair: Pair
  children: ReactNode
  farmId: number
  chefType: Chef
}

const _PoolPositionStakedProvider: FC<_PoolPositionStakedProviderProps> = ({ pair, farmId, chefType, children }) => {
  const { reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(pair)

  const { balance, isLoading, isError, withdraw, deposit, isWritePending, isWriteError } = useMasterChef({
    chainId: pair.chainId,
    chef: chefType,
    pid: farmId,
    token: liquidityToken,
  })

  const stakedUnderlying = useUnderlyingTokenBalanceFromPair({
    reserve0: reserve0,
    reserve1: reserve1,
    totalSupply,
    balance,
  })

  const [underlying0, underlying1] = stakedUnderlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: stakedUnderlying })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          value0,
          value1,
          underlying0,
          underlying1,
          isLoading,
          isError,
          withdraw,
          deposit,
          isWritePending,
          isWriteError,
        }),
        [
          balance,
          deposit,
          isError,
          isLoading,
          isWriteError,
          isWritePending,
          underlying0,
          underlying1,
          value0,
          value1,
          withdraw,
        ]
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPositionStaked = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Staked Context')
  }

  return context
}