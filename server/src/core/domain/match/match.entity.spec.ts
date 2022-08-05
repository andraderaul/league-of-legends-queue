import crypto from 'crypto'
import { Match, MatchProps } from './match.entity'

const SIDES = ['BLUE' as const, 'RED' as const]

describe('Testing Match entity', () => {
  const matchProps: MatchProps = {
    playerId: crypto.randomUUID(),
    side: 'BLUE',
  }
  const match = new Match(matchProps)
  test('testing constructor', () => {
    expect(match.toJson()).toStrictEqual({
      id: expect.any(String),
      blueSide: [matchProps.playerId],
      redSide: [],
      status: 'CHAMPION_SELECT',
      winner: 'NOT_YET_FINISHED',
    })
  })

  test('testing constructor, with missing side property', () => {
    const matchProps2: MatchProps = {
      playerId: crypto.randomUUID(),
      //@ts-expect-error testing when side is undefined
      side: undefined,
    }

    try {
      new Match(matchProps2)
    } catch (err: any) {
      expect(err?.message).toStrictEqual('Missing side property')
    }
  })

  test.each(SIDES)(
    'addPlayer method, should not add more than five player per side',
    (side) => {
      const matchProps2: MatchProps = {
        playerId: crypto.randomUUID(),
        side: side,
      }

      try {
        const match = new Match(matchProps2)

        for (let i = 0; i < 6; i++) {
          match.addPlayer(crypto.randomUUID(), side)
        }
      } catch (err: any) {
        expect(err?.message).toStrictEqual(
          `Max Players per ${side.toLocaleLowerCase()} side exceeded`
        )
      }
    }
  )

  test.each(SIDES)(
    'addPlayer method, should not add twice the same player',
    (side) => {
      const matchProps2: MatchProps = {
        playerId: crypto.randomUUID(),
        side: side,
      }

      try {
        const match = new Match(matchProps2)

        const id = crypto.randomUUID()
        match.addPlayer(id, side)
        match.addPlayer(id, side)
      } catch (err: any) {
        expect(err?.message).toStrictEqual(
          `There are duplicated players in ${side.toLocaleLowerCase()} side`
        )
      }
    }
  )

  test('updateStatus method', () => {
    const status = 'FINISHED'
    match.updateStatus(status)
    expect(match.status).toBe(status)
  })

  test('updateWinner method', () => {
    const winner = 'REMAKE'
    match.updateWinner(winner)
    expect(match.winner).toBe(winner)
  })
})
