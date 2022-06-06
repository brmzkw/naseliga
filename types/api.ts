export type LeaderBoardMatch = {
  player_a: string
  player_b: string
  score_a: number
  score_b: number
}

export type LeaderBoardEvent = {
  date: string
  matches: LeaderBoardMatch[]
}

export type LeaderBoardEntry = {
  player: string
  score: number
}

export type LeaderBoardAPIResponse = {
  events: LeaderBoardEvent[]
  leaderboard: LeaderBoardEntry[]
}
