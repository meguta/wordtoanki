
// Imports 
import {
    Flex, Stack, Heading, Button, Text, Box, HStack, Divider, ButtonGroup, Radio, RadioGroup,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
    useToast, CircularProgress, CircularProgressLabel
} from '@chakra-ui/react';
import { React, useState, useEffect, useRef } from 'react';
import { ImageSelection } from './ImageSelection';



/**
 * JSX component that displays a page that reviews question and answer pairs
 * @param {Array} props  
 * @returns JSX component of ReviewMode
 */
export function ReviewMode({ currentPage, setCurrentPage, imageList, setImageList, fieldList, fileName }) {
    const [showQuestions, setShowQuestions] = useState(true)
    const [completedQuestions, setCompletedQuestions] = useState([])
    const [repeatedQuestions, setRepeatedQuestions] = useState([])
    const [isTimer, setIsTimer] = useState(false)
    const [seconds, setSeconds] = useState(60)
    const [shiftDown, setShiftDown] = useState(false)
    const [currentCycle, setCurrentCycle] = useState(0)
    const [value, setValue] = useState("1")
    const [exportQuestions, setExportQuestions] = useState([])
    const [autoSaveData, setAutoSaveData] = useState({})
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const toast = useToast()
    const nextCycleToast = {
        title: 'Next Review Cycle ' + (currentCycle+1),
        description: "You have started the next cycle of review.",
        status: 'success',
        duration: 5000,
        isClosable: true,
    }
    const toggleQuestionToast = {
        title: "Question toggle",
        description: 'Questions have been toggled ' + ((showQuestions) ? "off." : "on."),
        status: 'info',
        duration: 5000,
        isClosable: true,
    }
    const timerToast = {
        title: 'Timer started.',
        description: "Study timer has started for 60 seconds",
        status: 'success',
        duration: 5000,
        isClosable: true,
    }

    /**
     * Gets repeated questions and set them for export
     */
    function exportSelectedQuestions() {
        var questions = []
        for (var i = 0; i < fieldList.length; i++) {
            console.log("getRepeatedQuestiosn: " + getRepeatedQuestions(i))
            if (getRepeatedQuestions(i) >= parseInt(value)) {
                questions.push(fieldList[i])
            }
        }
        setExportQuestions(questions)
    }

    /**
     * Gets the section the number
     * @param {number} length number of questions
     * @param {number} index current index value
     * @returns current section index is in
     */
    function getSectionNumber(length, index) {
        var questionNum = 25
        var numSection = Math.ceil(length / questionNum)
        var sectionSize = Math.floor(length / numSection)

        for (var i = 1; i <= numSection; i++) {
            if (index > (i - 1) * sectionSize && index <= i * sectionSize) {
                return i
            }
        }
    }

    /**
     * Displays the divider between sections    
     * @param {number} index current index
     * @returns JSX of divider
     */
    function displayDivider(index) {
        if ((index != 0 && index < fieldList.length - 3) && getSectionNumber(fieldList.length, index) != getSectionNumber(fieldList.length, index + 1)) {
            return <Box>
                <br />
                <Divider />
                <Text as="b" textColor="gray.600">Section {getSectionNumber(fieldList.length, index)+1}</Text>
                <br />
            </Box>
        } 
    }

    /**
     * Gets the number of times a question has been repeated
     * @param {number} index current index
     * @returns number of repeated for specified index
     */
    function getRepeatedQuestions(index) {
        return repeatedQuestions.filter(i => i == index).length
    }

    /**
     * Inserts tab between start of line and question
     * @param {string} note study question or answer
     * @returns spacing from tab character
     */
    function insertTab(note) {
        var tabCount = 0
        for (var i = 0; i < note.length; i++) {
            if (note[i] == '\t') tabCount++;

        }
        return '\u00A0'.repeat(tabCount * 20)
    }
    function loadData() {
        var loadedData = JSON.parse(localStorage.getItem("autosavedata"))
        if (loadedData) {
            setCompletedQuestions(loadedData.completedQuestions)
            setRepeatedQuestions(loadedData.repeatedQuestions)
            setCurrentCycle(loadedData.currentCycle)
            setExportQuestions(loadedData.exportQuestions)

        }
    }

    /**
     * Displays the question and answer pairs to be tested
     * @returns JSX group of formatted test questions
     */
    function displayTestQuestions() {
        return fieldList.map((notePair, index) => {
            var isCompleted = completedQuestions.includes(index)

            const questionStyles = {
                textOverflow: 'break-word',
                color: (isCompleted) ? "green.300" : "white",
                cursor: "auto",
                _hover: {
                    cursor: (!getRepeatedQuestions(index) != 0) ? "pointer" :
                        (shiftDown) ? "pointer" : "auto"
                }
            }
            const answerStyles = {
                textOverflow: 'break-word', color: (isCompleted) ? "green.600" : (showQuestions) ? "gray.500" : "transparent", transition: "0.3s",
                filter: (isCompleted) ? "none" : (showQuestions) ? "none" : "blur(16px)",
                cursor: "auto", 
                _groupHover: (shiftDown) ? { cursor: "pointer", color: "red.500", filter: "none" } : {}
            }


            const boxStyles = {
                rounded: "md",
                padding: "1",
                borderWidth: "2px",
                borderColor: (isCompleted) ? "green.800" :
                    (getRepeatedQuestions(index) == 1) ? "red.800" :
                    (getRepeatedQuestions(index) == 2) ? "red.700" :
                    (getRepeatedQuestions(index) >= 3) ? "red.600" : "gray.700",
                width: "100%",
                textOverflow: "break-word",
                transition: "0.3s",
                _hover: {
                    boxShadow: (isCompleted) ? "0 0 0.5rem 0.05rem var(--chakra-colors-green-800)" :
                        (getRepeatedQuestions(index) == 1) ? "0 0 0.5rem 0.05rem var(--chakra-colors-red-800)" :
                        (getRepeatedQuestions(index) == 2) ? "0 0 0.5rem 0.05rem var(--chakra-colors-red-700)" :
                        (getRepeatedQuestions(index) >= 3) ? "0 0 0.5rem 0.05rem var(--chakra-colors-red-600)" : "0 0 0.5rem 0.05rem var(--chakra-colors-gray-700)"
                }

            }

            const repeatStyles = {
                rounded: "md",
                width: "2rem",
                padding: "1",
                borderWidth: "2px",
                bgColor: (isCompleted) ? "green.800" :
                    (getRepeatedQuestions(index) == 1) ? "red.800" :
                    (getRepeatedQuestions(index) == 2) ? "red.700" :
                    (getRepeatedQuestions(index) >= 3) ? "red.600" : "gray.700",
                textOverflow: "break-word",
                transition: "0.3s",

            }

            function saveData() {
                var newData = {completedQuestions, repeatedQuestions, currentCycle, exportQuestions, }
                setAutoSaveData(newData)
                localStorage.setItem("autosavedata", JSON.stringify(newData))
            }

            function handleQuestionClick (e) {
                console.log("click-deteced")
                setRepeatedQuestions(i => {
                    if (!shiftDown && (i.filter(item => item == index).length <= currentCycle) && !completedQuestions.includes(index)) {
                        saveData()
                        return [...i, index]
                    } else if (shiftDown) {
                        saveData()
                        return i.filter(item => item != index)
                    } else {
                        return i
                    }
                })
            }

            const amountRepeated = (getRepeatedQuestions(index) > 0) ? getRepeatedQuestions(index).toString() + " " : ""
            return (<Box>
                <Stack direction="row">
                    <Flex sx={repeatStyles} alignItems="center" justifyContent="center">
                        <Text as="span">{amountRepeated}</Text>
                    </Flex>
                    <Box role="group" sx={boxStyles} onClick={handleQuestionClick}>
                        <Text as="span" sx={questionStyles}>{insertTab(notePair.front)}{notePair.front} </Text>
                        <Text as="span" sx={answerStyles}>{notePair.back}</Text>
                    </Box>

                </Stack>
                {displayDivider(index)}
            </Box>)
        }
        )
    }


    /**
     * Displays the study timer
     * @returns JSX object of study timer
     */
    function displayTimer() {

        const timerOnStyle = {
            zIndex: "10",
            transition: "0.3s",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%", 
            height: "100%",
            backdropFilter: "blur(4px)",
            bgColor: "transparent",
            justifyContent: "center",
            alignItems: "center"
        }

        const timerOffStyle = {
            zIndex:"-1",
            transition: "0.3s",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%", 
            height: "100%",
            backdropFilter: "none",
            bgColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
        }

        return (

            <Flex sx={isTimer ? timerOnStyle : timerOffStyle} direction="column">
                <Box borderWidth="2px" 
                    borderImage= "linear-gradient(#f6b73c, #4d9f0c) 30"
                    borderStyle="solid"

                   boxShadow="0 0 0.5rem 0.05rem inset var(--chakra-colors-gray-600)" transition="0.3s" padding="1rem" position="fixed" top={isTimer ? "20%" : "100%"}bgColor="gray.700" rounded="4rem">
                    <Heading textAlign="center" fontSize="2rem" padding="2rem">Study Timer</Heading>
                    <CircularProgress color="gray.600"size="22rem" value={seconds<0 ? 0 : (seconds/60)*100}>
                        <CircularProgressLabel>
                            <Text as="span" fontSize="8rem">{seconds<0 ? 0 : seconds} </Text>
                        </CircularProgressLabel>

                    </CircularProgress>
                </Box>
            </Flex>
        )
    }


    
    useEffect(() => {

        function handleKeyDown(e) {
            const { key, keyCode } = e
            if (key == "Shift") setShiftDown(true)
        }

        function handleKeyUp(e) {
            const { key, keyCode } = e
            if (key == "Shift") setShiftDown(false)

        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        if (isTimer) {
            if (seconds == -1) {
                setIsTimer(false)
            }
            const interval = setInterval(() => {
                setSeconds(curr => curr - 1)
            }, 1000)
            return () => {
                clearInterval(interval)
                window.removeEventListener("keydown", handleKeyDown)
                window.removeEventListener("keyup", handleKeyUp)
            }
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }

    }, [setIsTimer, isTimer, setSeconds, seconds])

    /**
     * Generates CSV file to export
     */
    function handleGenerate () {

        var data = []
        var headers = ["Front", "Back", "FrontOpt", "BackOpt", "Img", "tags"]
        for (let i = 0; i < exportQuestions.length; i++) {
            console.log("filename: " + fileName)
            var img = exportQuestions[i].image
            var tag = fileName.replace(" - CSV.csv", "")
            console.log("yes 2")
            tag = tag.replace(/\ /g, "")
            img = img.replace(/[\(\)]+/g, '')

            var row = [exportQuestions[i].front, exportQuestions[i].back, exportQuestions[i].parentFront, exportQuestions[i].parentBack, img, tag]
            data.push(row)
        }
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + data.map(row =>
                row
                .map(String)  // convert every value to String
                .map(v => v.replaceAll('"', '""'))  // escape double quotes
                .map(v => `"${v}"`)  // quote it
                .join(',')  // comma-separated
              ).join('\r\n');  // rows starting on new lines

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link); // Required for FF
        
        link.click(); // This will download the data file named "my_data.csv".
    }

    return (
        <Stack marginBottom="4rem" width="100vw" padding="4" spacing="2">
            <Heading size="sm" textAlign="center">5. review mode</Heading>
            <Heading textAlign="center">{fileName.replace(/ -.*/gm, "")}</Heading>
            {displayTimer()}
            {displayTestQuestions()}
            <Box role="group" transition="0.3s" left="0" bgColor="transparent" backdropFilter="blur(4px)" borderColor="gray.400" textColor="gray.400" borderWidth="3px" padding="2" borderBottomRightRadius="1rem" position="fixed" top="0">
                <Text textAlign="center" as="b">Cycle number {currentCycle}</Text>
                <Box transition="0.8s" _groupHover={{opacity: "1", maxHeight:"100px", maxWidth: "20rem"}} overflow="hidden" opacity="0" maxHeight="0px" maxWidth="0px">
                    <Text>Estimated total time of {fieldList.length} minutes left</Text>
                    <Text>{completedQuestions.length} of {fieldList.length} questions learnt.</Text>
                </Box>
            </Box>
            <Stack tabIndex="0" padding="2" boxShadow="xl" rounded="md" background="gray.700" direction="column" position="fixed" top="3" right="-25rem" transition="0.3s" _hover={{ right: "3" }} _focus={{right: "3"}}>
                <HStack justifyContent="center">
                    <Button onClick={(e) => 
                        {setShowQuestions(prev => !prev)
                        toast(toggleQuestionToast)
                        }}>Toggle Questions</Button>
                    <ButtonGroup size="md" isAttached variant="outline">
                        <Button onClick={(e) => {
                            setIsTimer(true)
                            setSeconds(60)
                            setShowQuestions(false)
                        }
                        }>Start Timer</Button>
                        <Button onClick={(e) => {
                            setCompletedQuestions(prev => {
                                var complete = [...prev]
                                for (var i = 0; i < fieldList.length; i++) {
                                    if (getRepeatedQuestions(i) <= currentCycle && !completedQuestions.includes(i)) {
                                        complete.push(i)
                                    }
                                }
                                return complete
                            })
                            console.log("CurrentCycle: " + currentCycle)
                            setCurrentCycle(prev => prev + 1)
                            toast(nextCycleToast)
                        }}>Next Cycle</Button>

                    </ButtonGroup>
                </HStack>
                <ButtonGroup size="md" variant="outline" width="100%">
                    <Button width="100%" onClick={(e) => setRepeatedQuestions([])}>Clear Repeated</Button>
                    <Button width="100%" onClick={(e) => setCompletedQuestions([])}>Clear Completed</Button>

                </ButtonGroup>
                <Button onClick={(e) => {
                    onOpen(e)
                    exportSelectedQuestions()
                }}>Export Questions</Button>
                <Button onClick={loadData}>Load Data</Button>
                <RadioGroup onChange={setValue} value={value}>
                    <HStack justifyContent="space-between">
                        <Radio value="1">1 cycle</Radio>
                        <Radio value="2">2 cycles</Radio>
                        <Radio value="3">3 cycles</Radio>
                    </HStack>
                </RadioGroup>

            </Stack>

            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Images</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ImageSelection currentPage={currentPage} setCurrentPage={setCurrentPage} fieldList={exportQuestions} setFieldList={setExportQuestions} imageList={imageList} setImageList={setImageList} />
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} variant="outline" colorScheme='green' onClick={handleGenerate}>Export Questions!</Button>
                        <Button mr={3} onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    )
}