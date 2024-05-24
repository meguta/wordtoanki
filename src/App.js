import { React, useState } from 'react';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import { theme } from './theme'
import  { Homepage } from "./Homepage"
import { ImageSelection }  from './ImageSelection';
import { GenerateCards } from './GenerateCards';
import  { Footer } from "./Footer"
import  { ReviewMode } from "./ReviewMode"
import { Schedule } from './Schedule';




function App() {

    const [currentPage, setCurrentPage] = useState("homepage")
    const [fieldList, setFieldList] = useState([])
    const [imageList, setImageList] = useState([])
    const [fileName, setFileName] = useState("")

    const [semesters, setSemesters] = useState([])

  function displayPage() {
    if (currentPage === "homepage") {
      return <Homepage 
      currentPage={currentPage} setCurrentPage={setCurrentPage} 
      fieldList={fieldList} setFieldList={setFieldList}
      imageList={imageList} setImageList={setImageList}
      fileName={fileName} setFileName={setFileName}/>
    }
    else if (currentPage === "imageselection") {
      return <ImageSelection currentPage={currentPage} setCurrentPage={setCurrentPage} fieldList={fieldList} setFieldList={setFieldList}imageList={imageList} setImageList={setImageList}/>

    } else if (currentPage === "generatecards") {
      return <GenerateCards fileName={fileName} setFileName={setFileName} currentPage={currentPage} setCurrentPage={setCurrentPage} fieldList={fieldList} setFieldList={setFieldList}imageList={imageList} setImageList={setImageList}/>

    } else if (currentPage === "reviewmode") {
      return <ReviewMode currentPage={currentPage} fileName={fileName} setFileName={setFileName} setCurrentPage={setCurrentPage} fieldList={fieldList} setFieldList={setFieldList} imageList={imageList} setImageList={setImageList}/>
    } else if (currentPage === "schedule") {
      return <Schedule semesters={semesters} setSemesters={setSemesters} />
    }

  } 
  return (
    <ChakraProvider theme={theme}>
      {displayPage()}
      <Footer semesters={semesters} setSemesters={setSemesters} currentPage={currentPage} setCurrentPage={setCurrentPage} imageList={imageList}/>
    </ChakraProvider>
  );
}

export default App;
