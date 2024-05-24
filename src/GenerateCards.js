import { Flex, Stack, Heading, Button, Text } from '@chakra-ui/react';
import { React, useState } from 'react';
import { CSVLink, CSVDownload} from "react-csv"
import {saveAs} from "file-saver"

export function GenerateCards ({currentPage, setCurrentPage, imageList, setImageList, fieldList, setFieldList, fileName, setFileName}) {
    const [csvLink, setCsvLink] = useState("")



    function generateCsv () {
      var data = [
      ]
      var headers = ["Front", "Back", "FrontOpt", "BackOpt", "Img", "tags"]
      for (let i = 0; i < fieldList.length; i++) {
        var img = fieldList[i].image
        var tag = fileName.replace(" - CSV.csv", "")
        tag = tag.replace(/\ /g, "")
        img = img.replace(/[\(\)]+/g, '')
        
        var row = [fieldList[i].front, fieldList[i].back, fieldList[i].parentFront, fieldList[i].parentBack, img, tag]
        data.push(row)
      } 
      setCsvLink(<CSVLink data={data} filename={fileName} separator={","} target="_blank">click me to download</CSVLink>)

    }

    function generateTxt () {
      var data = ""
      for (let i =0; i<fieldList.length; i++) {
        data = data + fieldList[i].front + '\n'
      }
      var file = new Blob([data], { type: 'text/plain;charset=utf-8' });
      var txtName = fileName.replace("CSV.csv", "Questions.txt")
      saveAs(file, txtName)

    }

    return (
        <>
            <Stack height="100vh" justifyContent="center" alignItems="center">
                <Heading>4. generate cards</Heading>
                <Text>click on the button to generate to get your csv file, then click on the link</Text>
                <Button padding="4rem" onClick={generateCsv}>
                  generate csv
                  </Button>
                  {csvLink}
                <Button padding="4rem" onClick={generateTxt}>generate txt of questions</Button>

            </Stack>
        </>
    )

}
