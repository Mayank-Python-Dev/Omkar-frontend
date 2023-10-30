import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportToExcel = ({details, fileName})=>{
    const fileType = "xlsx"

    const exportToCsv = ()=>{
        const ws = XLSX.utils.json_to_sheet(details)
        const wb = {Sheets:{data:ws}, SheetNames:["data"]}
        const excelBuffer = XLSX.write(wb, {bookType:"xlsx", type:"array"})
        const data = new Blob([excelBuffer], {type:fileType})
        FileSaver.saveAs(data, `${fileName}.xlsx`)
    }
    return(
        <span onClick={exportToCsv}>Excel</span>
    )
}

