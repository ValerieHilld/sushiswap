import { SplashController as UISplashController } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

import { useTokenState } from './token/TokenProvider'

export const SplashController: FC<{ show: boolean; children: ReactNode }> = ({ show = true, children }) => {
  const { token0, token1, toChainId, fromChainId } = useTokenState()
  return (
    <UISplashController show={show || !token0 || !token1 || !toChainId || !fromChainId}>{children}</UISplashController>
  )
}
