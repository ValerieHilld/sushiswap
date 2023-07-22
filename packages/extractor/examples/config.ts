import { ChainId } from '@sushiswap/chain'
import { LiquidityProviders } from '@sushiswap/router'
import { SUSHISWAP_V2_FACTORY_ADDRESS, SUSHISWAP_V2_INIT_CODE_HASH } from '@sushiswap/v2-sdk'
import { POOL_INIT_CODE_HASH } from '@sushiswap/v3-sdk'
import { mainnet } from '@sushiswap/viem-config'
import { Address } from 'viem'

export const ROUTE_PROCESSOR_3_ADDRESS = {
  [ChainId.ETHEREUM]: '0x827179dD56d07A7eeA32e3873493835da2866976' as Address,
  [ChainId.POLYGON]: '0x0a6e511Fe663827b9cA7e2D2542b20B37fC217A6' as Address,
  [ChainId.ARBITRUM]: '0xfc506AaA1340b4dedFfd88bE278bEe058952D674' as Address,
  [ChainId.OPTIMISM]: '0x4C5D5234f232BD2D76B96aA33F5AE4FCF0E4BFAb' as Address,
  [ChainId.CELO]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
}

export const TICK_LENS_ADDRESS = {
  [ChainId.ETHEREUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.POLYGON]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.ARBITRUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.OPTIMISM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573' as Address,
  [ChainId.CELO]: '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D' as Address,
}

function sushiswapV2Factory(chain: 1) {
  return {
    address: SUSHISWAP_V2_FACTORY_ADDRESS[chain] as Address,
    provider: LiquidityProviders.SushiSwapV2,
    fee: 0.003,
    initCodeHash: SUSHISWAP_V2_INIT_CODE_HASH[chain],
  } as const
}

export const UniswapV2FactoryAddress = {
  [ChainId.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
} as const
function uniswapV2Factory(chain: 1) {
  return {
    address: UniswapV2FactoryAddress[chain] as Address,
    provider: LiquidityProviders.UniswapV2,
    fee: 0.003,
    initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  } as const
}
export const UniswapV3FactoryAddress = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.BSC]: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
  [ChainId.CELO]: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc',
} as const
function uniswapV3Factory(chain: 1) {
  return {
    address: UniswapV3FactoryAddress[chain] as Address,
    provider: LiquidityProviders.UniswapV3,
    initCodeHash: POOL_INIT_CODE_HASH,
  } as const
}

export const EXTRACTOR_CONFIG = {
  [ChainId.ETHEREUM]: {
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    factoriesV2: [uniswapV2Factory(ChainId.ETHEREUM), sushiswapV2Factory(ChainId.ETHEREUM)],
    factoriesV3: [uniswapV3Factory(ChainId.ETHEREUM)],
    tickHelperContract: TICK_LENS_ADDRESS[ChainId.ETHEREUM],
    cacheDir: './cache',
    logDepth: 50,
    logging: true,
    routeProcessor3Address: ROUTE_PROCESSOR_3_ADDRESS[ChainId.ETHEREUM],
  },
}