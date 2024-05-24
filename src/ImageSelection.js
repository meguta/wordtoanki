import { React, useState, useEffect } from 'react';
import {
    Text,
    Box,
    Heading,
    Flex,
    Stack,
    Input,
    Button,
    Card, CardBody, StackDivider, Image, SimpleGrid, CardHeader
} from '@chakra-ui/react';

export function ImageSelection({ currentPage, setCurrentPage, imageList, setImageList, fieldList, setFieldList }) {
    const [cardCount, setCardCount] = useState(0)
    function displaySelectableImages() {
        var temp = imageList.map(img => img.replace(/[\(\)]+/g, ''))
        return temp.map(imgSrc => <Image maxWidth="12rem" borderRadius="1rem" maxHeight="12rem" filter="brightness(20%)" src={imgSrc} transition="0.5s" onClick={handleImageSelection} _hover={{ cursor: "pointer", boxShadow: "dark lg", filter: "brightness(100%)" }} />)

    }

    function handleImageSelection(e) {
        var updatedCard = fieldList[cardCount]
        updatedCard.image = e.currentTarget.src
        setFieldList(prev => [...prev.slice(0, cardCount), updatedCard, ...prev.slice(cardCount + 1)])
    }

    function changeCurrentCard(e) {
        if (e.currentTarget.id === "prev") {
            if (cardCount > 0) setCardCount(prev => prev - 1)
            else setCardCount (fieldList.length-1)
        }
        else if (e.currentTarget.id === "next") {
            if (cardCount < fieldList.length - 1) setCardCount(prev => prev + 1)
            else setCardCount(0)
        } else if (e.currentTarget.id === "clear") {
            var updatedCard = fieldList[cardCount]
            updatedCard.image = ""
            setFieldList(prev => [...prev.slice(0, cardCount), updatedCard, ...prev.slice(cardCount + 1)])

        }

    }

    function displayCurrentCard() {
        if (cardCount < fieldList.length) {
            let elm = fieldList[cardCount]
            return (
                <Flex direction="column" alignItems="center" justifyContent="center">
                    <Card width="100%">
                        <CardHeader>
                            <Text>Card Number {cardCount + 1} out of {fieldList.length}</Text>
                            <Stack direction="horizontal" width="100%" justifyContent="space-between">
                                <Button id="prev" onClick={changeCurrentCard}>back (a)</Button>
                                <Button id="next" onClick={changeCurrentCard}>next (d)</Button>
                                <Button id="clear" onClick={changeCurrentCard}>Clear image</Button>
                            </Stack>
                        </CardHeader>
                        <CardBody>
                            <Stack maxHeight="35vh" width="100%" overflowY="hidden" direction="row" divider={<StackDivider />} spacing="2">
                                <Box maxHeight="35vh" >
                                    <Heading fontSize="sm">Selected Image</Heading>
                                    <Image maxWidth="12rem" maxHeight="12rem" src={elm.image} />
                                </Box>
                                <Box maxHeight="35vh" minWidth="20vw" overflow="auto">
                                    <Heading fontSize="sm" textAlign="left">Front Side</Heading>
                                    <Text textAlign="center" p="2">{elm.front}</Text>

                                    <Text textAlign="center" p="2" fontSize="xs"> ParentFront: {elm.parentFront}</Text>
                                    <Text textAlign="center" p="2" fontSize="xs"> ParentBack: {elm.parentBack}</Text>
                                </Box>
                                <Box maxHeight="35vh" minWidth="20vw" overflow="auto">
                                    <Heading fontSize="sm" textAlign="left">Back Side</Heading>
                                    <Text textAlign="center" p="2">{elm.back}</Text>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </Flex>
            )

        }

    }

    useEffect(() => {
        function handleKeyDown(e) {
            console.log(e.key)
            if (e.key === "a") {
                if (cardCount > 0) setCardCount(prev => prev - 1)
                else setCardCount (fieldList.length-1)
            } else if (e.key === "d") {
                if (cardCount < fieldList.length - 1) setCardCount(prev => prev + 1)
                else setCardCount(0)
            }
        }
        document.addEventListener('keydown', handleKeyDown)

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [fieldList, cardCount])

    return (
            <Stack width="100%">
                <Box width="100%" padding="1rem">
                    <Heading fontSize="sm">Images</Heading>
                    <Stack direction="row" maxWidth="100%" overflowY="hidden">
                        {displaySelectableImages()}
                    </Stack>
                </Box>
                {displayCurrentCard()}

            </Stack>
    )

}
