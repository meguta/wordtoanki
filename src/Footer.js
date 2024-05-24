import {
    Stack, Heading, Button, Text, Image, Box,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton, useDisclosure, ChakraProvider, useColorMode
} from '@chakra-ui/react';
import { React, useState, useEffect, useRef} from 'react';
import { theme } from './theme'

import { Schedule } from './Schedule';
import { createRoot } from 'react-dom/client';
import NewWindow from 'react-new-window'


export function Footer({ setCurrentPage, currentPage, imageList, setSemesters, semesters }) {

    const {colorMode, toggleColorMode} = useColorMode ()
    const [pictureToggle, setPictureToggle] = useState(false)
    const [focusedImage, setFocusedImage] = useState(-1)
    const [showPopup, setShowPopup] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const drawerRef = useRef()


    function displayPopoutImages() {
        var temp = imageList.map(img => img.replace(/[\(\)]+/g, ''))
        return temp.map((imgSrc, index) => {

            const defaultStyle = {
                borderRadius: "1rem", maxHeight: "98vh", objectFit: "contain", width: "auto", height: "auto",
                transition: "0.3s", 
                _hover: {boxShadow: "0px 0px 3px 1px black" }
            }

            return (
                <Image sx={defaultStyle} src={imgSrc} />
            )

        })

    }
    function displaySelectableImages() {
        var temp = imageList.map(img => img.replace(/[\(\)]+/g, ''))
        return temp.map((imgSrc, index) => {

            const defaultStyle = {
                maxWidth: "16rem", maxHeight: "16rem", borderRadius: "1rem",
                filter: "brightness(60%)", transition: "0.3s",
                _hover: { cursor: "pointer", boxShadow: "dark lg", filter: "brightness(100%)" }
            }

            const selectedStyle = {
                height: "75vh", width: "auto", borderRadius: "1rem", position: 'fixed',
                top: "0", left: "50%", transform: "translate(-50%, -50%)",
                filter: "brightness(100%)", transition: "0.3s", zIndex: "100",
                _hover: { cursor: "pointer", boxShadow: "dark lg", filter: "brightness(100%)" }
            }

            var currentStyle = (focusedImage == index) ? selectedStyle : defaultStyle
            return (
                <Image sx={currentStyle} src={imgSrc} onClick={(e) => setFocusedImage(prev => {
                    if (prev == index) {
                        return -1
                    } else {
                        return index

                    }
                })} />
            )

        })
    }

    function displayScheduleDrawer() {
        return (
            <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={drawerRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Schedule</DrawerHeader>

                    <DrawerBody>
                        <Schedule setSemesters={setSemesters} semesters={semesters}/>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    function displayWindow() {
        if (showPopup) {
            return (
                <NewWindow onUnload={(e) => setShowPopup(false)}>
                    <Stack direction="row" p="0.5rem">
                        {displayPopoutImages()}
                    </Stack>
                </NewWindow>
            )
        }
    }

    useEffect(() => {
        function handleKeyDown(e) {
            var btn = document.getElementById("showpictures")
            if (e.key === "p") {
                btn.click()
            }
        }
        document.addEventListener('keydown', handleKeyDown)

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown)
        }
    },)


    return (
        <Stack marginTop="3rem" boxShadow="2xl" padding="1rem" bg="gray.800" width="100%" position="fixed" bottom="0" justifyContent="center" direction="horizontal">
            <Box transition="0.5s 0.3s" p="1rem" backdropFilter="blur(4px)" borderRadius="1rem" borderWidth="3px" borderBottomWidth="0" borderColor="gray.600" bgColor="transparent" width="100%" direction="row" position="fixed" bottom={pictureToggle ? "4rem" : "-25rem"}>
                {/* <Heading fontSize='sm' p="2" position="sticky" textAlign="center">Images</Heading> */}
                <Stack height="16rem" direction="row" overflowX="scroll">
                    {displaySelectableImages()}
                    <Button height="100%" minWidth="30%" onClick={(e) => setShowPopup(true)}>click me to open in new tab</Button>
                </Stack>
            </Box>
            <Button onClick={(e) => setCurrentPage("homepage")}>homepage</Button>
            <Button onClick={(e) => setCurrentPage("reviewmode")}>review mode</Button>
            <Button id="showpictures" variant="outline" onClick={(e) => setPictureToggle(prev => {
                setFocusedImage(-1)
                return !prev
            })}>show pictures (p)</Button>
            <Button ref={drawerRef} onClick={onOpen} variant="outline">show schedule</Button>
            {displayScheduleDrawer()}
            {displayWindow()}
            <Button onClick={toggleColorMode}>toggle dark mode</Button>
        </Stack>

    )
}
