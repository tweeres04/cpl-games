import { readFile } from 'node:fs/promises'
import ical, { ICalEventData } from 'ical-generator'
import { join } from 'node:path'

const targetTeamName = process.env.TEAM_NAME || 'Pacific FC'

type Competition = {
	name: string
}

type Contestant = {
	officialName: string
	position: 'home' | 'away'
}

type Stage = {
	name: string
}

type Venue = {
	longName: string
}

type MatchInfo = {
	date: string
	time: string
	competition: Competition
	contestant: Contestant[]
	stage: Stage
	venue: Venue
}

type Match = {
	matchInfo: MatchInfo
}

type Data = {
	match: Match[]
}

function isHome(teams: Contestant[]) {
	const targetTeam = teams.find((t) => t.officialName === targetTeamName)

	if (!targetTeam) {
		throw 'target team not found in match'
	}

	return targetTeam.position === 'home'
}

function dateAndTimeStringToIsoString(dateString: string, timeString: string) {
	dateString = dateString.replace('Z', 'T')
	return `${dateString}${timeString}`
}

function matchToEvent(match: Match): ICalEventData {
	const vsText = isHome(match.matchInfo.contestant) ? 'vs' : 'at'
	const opponent = match.matchInfo.contestant.find(
		(c) => c.officialName !== targetTeamName
	)

	if (!opponent) {
		throw 'opponent team not found in match'
	}

	const startDateTime = dateAndTimeStringToIsoString(
		match.matchInfo.date,
		match.matchInfo.time
	)

	return {
		summary: `${targetTeamName} ${vsText} ${opponent.officialName}`,
		start: startDateTime,
		description: `${match.matchInfo.competition.name} - ${match.matchInfo.stage.name}`,
		location: {
			title: match.matchInfo.venue.longName,
		},
	}
}

const targetTeamJsonFile = `${targetTeamName}.json`
let data: Data

try {
	data = JSON.parse(await readFile(join('data', targetTeamJsonFile), 'utf8'))
} catch (err) {
	if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
		console.error(`Couldn't find ${targetTeamJsonFile} in the data folder`)
		process.exit(1)
	}
	throw err
}

const { match: matches } = data
const events = matches.map(matchToEvent)
const calendar = ical({
	name: `${targetTeamName} Schedule`,
	events: events,
})

const filename = `${targetTeamName}.ical`

await calendar.save(filename)

console.table(events)

console.log(`Saved ${filename}`)
