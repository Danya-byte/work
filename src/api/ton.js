import { TonConnectUI } from "@tonconnect/ui"

export const tonConnectUI = () => {
    return new TonConnectUI({
        manifestUrl: 'https://raw.githubusercontent.com/Stttnsik1/tonconnect-manifest.json/refs/heads/main/tonconnect-manifest.json',
        buttonRootId: 'ton-connect'
    })
}

