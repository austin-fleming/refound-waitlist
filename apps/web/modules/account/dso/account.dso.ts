export type AccountDSO = {
    id: string,
    uses_provider: boolean,
    provider_type?: string // req'd if uses_provider
    provider_email?: string // req'd if uses_provider
    wallet_address: string
    wallet_chain: string
    wallet_chain_id?: number // req'd if wallet_chain === 'ethereum'
    created_at: string
    updated_at: string
}