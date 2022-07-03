

type UuidV4 = string
type EthAddress = string
type SolAddress = string
type Email = string
type Web3Id = string
type CreatorHandle = string
type Timestamp = string

type UserType = "doxxed" | "anonymous"

export type UserDSO = {
    id: UuidV4,
    chain_public_key: EthAddress | SolAddress,
    chain: "ethereum" | "solana"
    type: UserType
    web3_id: Web3Id
    email?: Email
    created_at: Timestamp
    updated_at: Timestamp
}

export type User = {
    id: UuidV4
    chainPublicKey: EthAddress | SolAddress
    chain: "ethereum" | "solana"
    type: UserType
    web3Id: Web3Id
    email?: Email
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type CreatorDSO = {
    id: UuidV4
    user_id: UuidV4
    handle: CreatorHandle
    created_at: Timestamp
    updated_at: Timestamp
}


export type FollowRelationDSO = {
    follower: CreatorDSO["id"]
    followee: CreatorDSO["id"]
}

type Creator = {
    id: UuidV4
    userId: UuidV4
    handle: CreatorHandle
    createdAt: Timestamp
    updatedAt: Timestamp
}

export type SuggestionDSO = {
    id: UuidV4
    creator_id: UuidV4
    content: string
    votes: number
    created_at: Timestamp
    updated_at: Timestamp
}

type Suggestion = {
    id: UuidV4
    creatorId: UuidV4
    content: string
    votes: number
    createdAt: Timestamp
    updatedAt: Timestamp
}

type ProfileAggregate = {
    id: Creator["id"]
    userType: UserType
    handle: Creator["handle"]
    suggestions: Suggestion[]
}


type UserService = {
    Exists: (id: UuidV4) => boolean
    Get: (id: UuidV4) => User
    Create: (props: Omit<User, "id">) => User
    Updated: (user: User) => User
    GetType: (id: UuidV4) => UserType
}

type CreatorService = {
    Exists: (id: UuidV4) => boolean
    HandleAvailable: (handle: CreatorHandle) => boolean
    Get: (id: UuidV4) => Creator
    GetByHandle: (handle: CreatorHandle) => Creator
    Create: (props: Omit<Creator, "id">) => Creator
}

type SuggestionService = {
    Exists: (id: UuidV4) => boolean
    Get: (id: UuidV4) => Suggestion
    GetByProfile: (creatorId: UuidV4) => Suggestion[]
    GetSome: (limit: number, offset: number) => Suggestion[]
    GetSomeByVotes: (limit: number, offest: number) => Suggestion[]
    AddVote: (suggestion: Suggestion) => number
}

type ProfileAggregateService = {
    Get: (creatorId: Creator["id"]) => ProfileAggregate
    GetByHandle: (creatorHandle: Creator["handle"]) => ProfileAggregate
}