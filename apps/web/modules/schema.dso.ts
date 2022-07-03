
type Uuidv4 = string
type Timestamp = string

export type FollowRelationDSO = {
    follower: ProfileDSO["id"]
    followee: ProfileDSO["id"]
    created_at: Timestamp
}

export type SuggestionDSO = {
    id: Uuidv4,
    account_profile: ProfileDSO["id"]
    content: string
    votes_for: number
    votes_against: number
    created_at: Timestamp
    updated_at: Timestamp
}