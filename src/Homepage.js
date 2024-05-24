// Imports
import { React, useState } from 'react';
import {
    Text,
    Box,
    Heading,
    Flex,
    Stack,
    Input,
    Card, CardHeader, CardBody, CardFooter, StackDivider, SimpleGrid, Image,
    Button, Skeleton
} from '@chakra-ui/react';
var mammoth = require("mammoth/mammoth.browser");

/**
 * JSX component that displays the homepage with elements to import word doc into questions
 * @param {Array} props 
 * @returns JSX component of homepage of app
 */
export function Homepage({ currentPage, setCurrentPage, fieldList, setFieldList, imageList, setImageList, fileName, setFileName }) {
    const [loading, setLoading] = useState(false)

    /**
     * Gets the level the selected question is, in relate to the other questions in the set
     * @param {string} question question from question and answer pair
     * @returns the tab level of the question
     */
    function getQuestionLevel(question) {
        let questionLevel = 0
        for (let j = 0; j < question.length; j++) {
            if (question[j] === '\t') {
                questionLevel++
            }
        }
        return questionLevel
    }

    /**
     * Handles the importing of files into the program
     * @param {Object} e event object
     * @returns if there is no file found
     */
    function handleFile(e) {
        setLoading(true)
        var filename = e.currentTarget.value
        filename = filename.replace("C:\\fakepath\\", "")
        filename = filename.replace("Notes.docx", "CSV.csv")
        setFileName(filename)
        console.log(filename)

        var files = e.currentTarget.files || []
        if (!files.length) return
        var file = files[0]

        var reader = new FileReader()
        reader.onloadend = function (event) {
            var arrayBuffer = reader.result

            mammoth.convertToMarkdown({ arrayBuffer }).then(function (resultObject) {
                parseMarkdownToObject(resultObject.value)
            })
        }
        reader.readAsArrayBuffer(file)

    }

    /**
     * Displays the images from the word doc
     * @returns mapped array of images
     */
    function displayImages() {
        var temp = imageList.map(img => img.replace(/[\(\)]+/g, ''))
        return temp.map(imgSrc => <Image src={imgSrc} />)
    }

    /**
     * Parses the markdown file into question and answer pairs
     * @param {Object} md markdown version of word doc
     */
    function parseMarkdownToObject(md) {

        var temp = md.replace(/ *(\(data:image)[^)]*\) */g, "")
        var matches = md.match(/ *(\(data:image)[^)]*\) */g)
        temp = temp.replace(/!\[[^)]*?\]/g, "")
        console.log(temp)
        if (matches) {
            setImageList(matches)
        }
        var questions = temp.split("\n- ")

        // Filter for questions
        questions = questions.filter(q => q.includes("?"))
        var tempArr = []
        for (let q = 0; q < questions.length; q++) {
            var questionGroup = questions[q].split("\n")
            console.log(questionGroup)

            // fixing up broken notes part 2
            for (let i = questionGroup.length - 1; i >= 0; i--) {
                var tabNum = (questionGroup[i].match(/\t/g) || []).length
                if (i != 0 && tabNum == 0 && questionGroup[i].includes("?")) {
                    for (let j = i - 1; j >= 0; j--) {
                        if (questionGroup[j].includes("?") && (questionGroup[j].match(/\t/g) || []).length > 0) {
                            var newTab = (questionGroup[j].match(/\t/g) || []).length + 1
                            console.log(newTab)
                            questionGroup[i] = '\t'.repeat(newTab) + questionGroup[i]
                            break;
                        }
                    }
                }
            }

            for (let i = 0; i < questionGroup.length; i++) {
                questionGroup[i] = questionGroup[i].split('\n')
            }
            questionGroup = questionGroup.filter(q => q[0].includes("?"))
            console.log(questionGroup)


            // Triming /t characters from end of string
            for (let i = 0; i < questionGroup.length; i++) {
                questionGroup[i][0] = questionGroup[i][0].replace(/\t+$/g, '')
                questionGroup[i][0] = questionGroup[i][0].replace("- ", "")
            }

            // question pairs
            for (let i = 0; i < questionGroup.length; i++) {
                let parentQ = questionGroup[0][0].split("? ")[0] + "?"
                let parentA = questionGroup[0][0].split("? ").pop()

                if (getQuestionLevel(questionGroup[i][0]) > 0) {
                    for (let j = i; j >= 0; j--) {
                        if (getQuestionLevel(questionGroup[j][0]) + 1 === getQuestionLevel(questionGroup[i][0])) {
                            parentQ = questionGroup[j][0].split("? ")[0] + "?"
                            parentA = questionGroup[j][0].split("? ").pop()
                            break;
                        }
                    }
                }

                let currentQ = questionGroup[i][0].split("? ")[0] + "?"
                let currentA = questionGroup[i][0].split("? ").pop()

                if (parentA == currentA && parentQ == currentQ) {
                    parentA = ""
                    parentQ = ""
                }


                currentQ = currentQ.replace(/\\/g, "")
                currentA = currentA.replace(/\\/g, "")
                parentQ = parentQ.replace(/\\/g, "")
                parentA = parentA.replace(/\\/g, "")

                currentA = currentA.replace(/🡪/g, "-->")
                currentQ = currentQ.replace(/🡪/g, "-->")
                parentA = parentA.replace(/🡪/g, "-->")
                parentQ = parentQ.replace(/🡪/g, "-->")


                tempArr.push({ front: currentQ, back: currentA, parentFront: parentQ, parentBack: parentA, image: "" })
            }
        }

        console.log(tempArr)
        setFieldList(tempArr)
        setLoading(false)
    }

    /**
     * Displays question and answer pairs as card types
     * @returns JSX component of displayed question
     */
    function displayGeneratedQuestions() {

        if (fieldList.length != 0)
            return fieldList.map(elm =>
                <Skeleton isLoaded={!loading} height="sm">
                    <Card minWidth="md" height="sm" maxHeight="sm" overflow="auto">
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing="2">
                                <Box>
                                    <Heading size="sm" textAlign="center">Front Side</Heading>
                                    <Text textAlign="center" p="4">{elm.front}</Text>

                                    <Text textAlign="center" p="4" fontSize="xs"> ParentFront: {elm.parentFront}</Text>
                                    <Text textAlign="center" p="4" fontSize="xs"> ParentBack: {elm.parentBack}</Text>
                                </Box>
                                <Box>
                                    <Heading textAlign="center">Back Side</Heading>
                                    <Text textAlign="center" p="4">{elm.back}</Text>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
               </Skeleton>
                )
        else if (fieldList.length == 0 && loading) return (
            <Skeleton>
                <Card minW="md" minH="sm">
                    <CardBody width="md" height="lg">
                    </CardBody>
                </Card>
            </Skeleton>
        )
        else if (fieldList.length == 0 && !loading) return (
            <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
                <Text as="cite">select something to load, you dummy.</Text>

            </Flex>
        )
    }

    return (
        <Stack spacing="2" padding="3" marginBottom="4rem" height="100vh">
            <Box>
                <Heading textAlign="center">wordtoanki</Heading>
                <Text textAlign="center">making anki flashcards from your notes, so you don't have to :)</Text>
            </Box>
            <Box>
                <Heading>1. file selection</Heading>
                <Text>to get started, first let's select a file you want to convert into notes.</Text>
                <Input type="file" onChange={handleFile} />
            </Box>
            <Box height="100%">
                <Heading>2. parsing into q&a</Heading>
                <Text>got your file? now let's (attempt) to parse that file into question and answer pairs. (p.s. there won't be any images yet)</Text>

                <Stack height="50vh" id="generatedQuestions" direction="row" overflow="auto" padding="0.5rem" margin="1rem" borderRadius="1rem" borderColor="gray.600" borderWidth="3px"  >
                    {displayGeneratedQuestions()}
                </Stack>
                <SimpleGrid spacing={4} columns={3}>
                    {displayImages()}
                </SimpleGrid>
            </Box>
        </Stack>
    )

}
