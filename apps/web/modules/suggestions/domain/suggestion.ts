import { Profile } from "modules/account/domain/profile"
import { SuggestionId } from "./suggestion-id"

export type Suggestion = {
    id: SuggestionId
    profile: Profile["id"]
    content: string
    votesFor: number
    votesAgainst: number
    votesAverage: number
    createdAt: Date
    updatedAt: Date
}