import FrameSDK from '@farcaster/frame-sdk'
import farcasterFrame from '@farcaster/frame-wagmi-connector'
import { wagmiConfig } from '@components/Web3Provider/wagmiConfig'
import { connect } from 'wagmi/actions'

function FarcasterFrameProvider({ children }) {
  useEffect(() => {
    const init = async () => {
      const context = await FrameSDK.context

      // Autoconnect if running in a frame.
      if (context?.client.clientFid) {
        connect(wagmiConfig, { connector: farcasterFrame() })
      }

      // Hide splash screen after UI renders.
      setTimeout(() => {
        FrameSDK.actions.ready()
      }, 500)
    }
    init()
  }, [])

  return <>{children}</>
}