import {
    Stack, Heading, Button, Text, Image, Box, Input, Checkbox, CheckboxGroup,
    Tabs, TabList, TabPanels, Tab, TabPanel, Divider
} from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';

const ical = require('cal-parser');
const moment = require("moment")
moment().format();

export function Schedule({setSemesters, semesters}) {

    const FIRST_WEEK_SEM_1 = 37
    const FIRST_WEEK_SEM_2 = 2
    

    function sortByDate(array) {
        return array.sort((a, b) => {
            return (
                new moment(a.dtstart.value, "ddd-MMM-YYYY-HH-mm-ss").unix() -
                new moment(b.dtstart.value, "ddd-MMM-YYYY-HH-mm-ss").unix())

        })

    }

    useEffect(() => {

    })


    function handleSelectCalendar(e) {
        //setIsLoaded(false)
        var files = e.currentTarget.files || []
        if (!files.length) return
        var file = files[0]

        var reader = new FileReader()
        reader.onloadend = function (event) {
            var arrayBuffer = reader.result

            const parsed = ical.parseString(arrayBuffer);
            // Read Calendar Metadata
            console.log(parsed.calendarData);

            // Read Events
            console.log(parsed.events);
            parseCalendarEvents(parsed.events)
          //  setIsLoaded(true)

        }
        reader.readAsText(file, 'ISO-8859-1');

    }

    function updateLocalStorage(newSem) {
        localStorage.setItem("semesters", JSON.stringify(newSem))
    }

    function getWeek(event) {
        return moment(event.dtstart.value, "ddd-MMM-YYYY-HH-mm-ss").week()
    }

    function parseCalendarEvents(unparsedEvents) {
        var sortedCalendar = sortByDate(unparsedEvents)
        var events = []

        for (let i = 0; i < sortedCalendar.length; i++) {
            var semester = (getWeek(sortedCalendar[i]) >= FIRST_WEEK_SEM_1 && getWeek(sortedCalendar[i]) <= FIRST_WEEK_SEM_1 + 11) ? "semester1" : "semester2"
            var week = (semester == "semester1") ?
                getWeek(sortedCalendar[i]) - FIRST_WEEK_SEM_1 :
                getWeek(sortedCalendar[i]) - FIRST_WEEK_SEM_2
            var eventType = ""
            var summary = sortedCalendar[i].summary.value
            if (sortedCalendar[i].summary.value.includes("Lecture:")) eventType = "Lecture"
            if (sortedCalendar[i].summary.value.includes("Guided Study:")) eventType = "Guided Study"
            if (sortedCalendar[i].summary.value.includes("Practical:")) eventType = "Practical"
            if (sortedCalendar[i].summary.value.includes("Clinical Skills Session:")) eventType = "Clinical Skills Session"
            if (sortedCalendar[i].summary.value.includes("Workshop:")) eventType = "Workshop"
            

            if (eventType != "") events.push({ summary, semester, week, eventType, checked: false })
        }
        var loadedSemesters = [events.filter(elm => elm.semester == "semester1"), events.filter(elm => elm.semester == "semester2")]

        setSemesters(loadedSemesters)
        localStorage.setItem("semesters", JSON.stringify(loadedSemesters))
    }

    function loadFromLocalStorage() {
        setSemesters(JSON.parse(localStorage.getItem("semesters")))
    }

    function displayCalenderEvents() {
        var eventJSX = semesters.map((sem, i) => {
            var weeks = []

            for (var j = 1; j <= 12; j++) {
                var currentWeek = []
                for (var k = 0; k < sem.length; k++) {
                    var currentEvent = sem[k]
                    if (currentEvent.week == j) {
                        currentWeek.push(currentEvent)
                    }
                }
                weeks.push(currentWeek)
            }



            function onInputChange(e) {
                var elm = e.target.name
                var isChecked = e.currentTarget.checked

                var updatedSemesters = semesters.map(semester => {
                    return semester.map(currEvent => {
                        if (currEvent.summary == elm) {
                            return { ...currEvent, checked: isChecked }
                        }
                        return currEvent
                    })
                })
                updateLocalStorage(updatedSemesters)
                setSemesters(updatedSemesters)

            }

            return (
                <Box>
                    <Heading p="2rem" textAlign="center">Semester {i + 1}</Heading>
                    <Tabs variant="enclosed" isFitted>
                        <TabList overflow="auto">
                            {weeks.map((week, j) =>
                                <Tab size="lg" minW="100%">Week {j + 1}</Tab>
                            )}
                        </TabList>
                        <TabPanels>
                            {weeks.map((week, j) => {
                                var lectures = week.filter(elm => elm.eventType == "Lecture")
                                var guidedStudies = week.filter(elm => elm.eventType == "Guided Study")
                                var practicals = week.filter(elm => elm.eventType == "Practical")
                                var clinicalSkillsSessions = week.filter(elm => elm.eventType == "Clinical Skills Session")
                                var workshops = week.filter(elm => elm.eventType == "Workshop")


                                return (
                                    <TabPanel>
                                        <Stack direction="column" spacing="1rem">
                                            <Box>
                                                <Text as="b">Lectures</Text>
                                                <Stack spacing="0" direction="column">
                                                    <CheckboxGroup>
                                                        {lectures.map(event =>
                                                            <Checkbox name={event.summary} isChecked={event.checked} onChange={onInputChange}>
                                                                <Text>{event.summary.replace(/["]+|(Lecture:)/gm, "")}</Text>
                                                            </Checkbox>
                                                        )}
                                                    </CheckboxGroup>
                                                </Stack>
                                            </Box>
                                            <Divider/>
                                            <Box>
                                                <Text as="b">Guided Studies</Text>
                                                <Stack spacing="0" direction="column">
                                                    {guidedStudies.map(event =>
                                                        <Checkbox name={event.summary} isChecked={event.checked} onChange={onInputChange}>
                                                            <Text>{event.summary.replace(/["]+|(Guided Study:)/gm, "")}</Text>
                                                        </Checkbox>
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Divider/>
                                            <Box>
                                                <Text as="b">Practicals</Text>
                                                <Stack spacing="0" direction="column">
                                                    {practicals.map(event =>
                                                        <Checkbox name={event.summary} isChecked={event.checked} onChange={onInputChange}>
                                                            <Text>{event.summary.replace(/["]+|(Practical:)/gm, "")}</Text>
                                                        </Checkbox>
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Divider/>
                                            <Box>
                                                <Text as="b">Clinical Skills Sessions</Text>
                                                <Stack spacing="0" direction="column">
                                                    {clinicalSkillsSessions.map(event =>
                                                        <Checkbox name={event.summary} isChecked={event.checked} onChange={onInputChange}>
                                                            <Text>{event.summary.replace(/["]+|(Clinical Skills Session:)/gm, "")}</Text>
                                                        </Checkbox>
                                                    )}
                                                </Stack>
                                            </Box>
                                            <Divider/>
                                            <Box>
                                                <Text as="b">Clinical Reasoning Workshops</Text>
                                                <Stack spacing="0" direction="column">
                                                    {workshops.map(event =>
                                                        <Checkbox name={event.summary} isChecked={event.checked} onChange={onInputChange}>
                                                            <Text>{event.summary.replace(/["]+|(Workshop:)/gm, "")}</Text>
                                                        </Checkbox>
                                                    )}
                                                </Stack>
                                            </Box>

                                        </Stack>
                                    </TabPanel>

                                )
                            }
                            )}

                        </TabPanels>
                    </Tabs>

                </Box>
            )
        })

        return (
            <Stack>
                {eventJSX}
            </Stack>
        )
    }

    return (
        <Stack spacing="2" padding="3" marginBottom="4rem" height="100vh">
            <Text as='b' textAlign="center">File Select</Text>
            <Stack>
                <Box>
                    <Text>Select calendar file</Text>
                    <Input id="cal" type="file" onChange={handleSelectCalendar} />
                </Box>
                <Box>
                    <Text> or load from localStorage</Text>
                    <Button onClick={loadFromLocalStorage}>Load previous data</Button>

                </Box>
            </Stack>
            {displayCalenderEvents()}
        </Stack>

    )
}
