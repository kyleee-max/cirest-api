import '../styles/globals.css'
import ApiKeyPopup from '../components/ApiKeyPopup'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ApiKeyPopup />
    </>
  )
}
