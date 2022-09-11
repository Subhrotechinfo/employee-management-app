import { Body, Controller, Get, Post, Request, Res, UploadedFile, UseInterceptors,Query, Param, Put, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { sendAccepted, sendBadRequest, sendCreated, sendInternalServerError, sendNotFound } from 'src/shared/response.helper';
import { FileService } from './file.service';
import * as crypto from "crypto";
import * as mime from "mime-types";
import * as XLSX from 'xlsx';
import { isValidMongoId, unlinkFile } from 'src/helpers/helper';
import * as fs from 'fs';
import { UpdateUserDto } from './dto/update-user-dto';
@ApiTags('Employee Management APIs')
@Controller('file')
export class FileController {

    constructor(
        // @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
        protected readonly fileService: FileService
    ) {
        // this.client = ClientProxyFactory.create(this.appConfigService.notifyExportList);
    }
    @Get()
    getHello(): string {
        // return this.appService.getHello();
        return;
    }


    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })

    @UseInterceptors(FileInterceptor('file',{
        limits: {fileSize:200000},
        storage:diskStorage({
            destination:'./files',
            filename: (req, file, cb) => {
            crypto.pseudoRandomBytes(16, function (err, raw) {
            return cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            });
        }
        }),
        fileFilter:(req, file, cb) => {
            // Update file name
            // console.log('i am here');
            // console.log('the file-- ', file)
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            cb(null, true)
        }
    }))
    async uploadFile(@UploadedFile() file:Express.Multer.File, @Request() req, @Res() res: Response) {
        let that = this;
        console.log('File Upload API Hit')
        let workbook, sheet_name_list, jsonArray = [], filePath;
        console.log('file upload process started.');
        console.log('---------------', file);
        if(!file){
            return sendInternalServerError(res,{});
        }
        // const user = req.user.parent_id ? req.user.parent_id : req.user.userId;
        let payload = {
            name: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            encoding: file.encoding,
            type: file.fieldname
        }

        // const response = {
        //     originalname: file.originalname,
        //     filename: file.filename,
        // };
        // return sendAccepted(res, '', 'file_uploaded');;

        // console.log('file',file)
        let fileName = file.filename;
        filePath = `./files/${fileName}`;
        that.fileService.create(payload)
        .then(async function (result) {
            console.log('file upload process end.');
            //convert and get the data
            workbook = XLSX.readFile(filePath);
            sheet_name_list = workbook.SheetNames;
            jsonArray = [...XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])]
            console.log('jsonarray file values------', jsonArray);
            
            //check if every object has values if empty reject
            //check the object length 
            // iterate each object
            // await jsonArray.forEach(item =>{
            //     if(Object.keys(item).length < 4){
            //         console.log('all values must be send.');
            //         // return sendBadRequest(res, {}, 'all values must be send id, name, salary , login'); 
            //     }
            // })
            let checkArrayObjEmptyValues = jsonArray.every(item => item.name && item.id && item.login && item.salary);
            console.log('checkArrayObjEmptyValues',checkArrayObjEmptyValues)
            if(checkArrayObjEmptyValues){
                // if file exist then delete
                if(fs.existsSync(filePath)){
                    // unlink the file - delete
                    unlinkFile(filePath);
                }
                return sendBadRequest(res, {}, 'all values must be send id, name, salary, login'); 
            }

            let columnHeaders = [];
            for (var sheetIndex = 0; sheetIndex < sheet_name_list.length; sheetIndex++) {
                var worksheet = workbook.Sheets[sheet_name_list[sheetIndex]];
                    for (let key in worksheet) {
                        let regEx = new RegExp("^\(\\w\)\(1\){1}$")  //(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/) //  ;
                        if (regEx.test(key) == true) {
                        columnHeaders.push(worksheet[key].v);
                        }
                    }
            }
            console.log('column header', columnHeaders);
            let format;
            //column headers special characters validations
            for (let index = 0; index < columnHeaders.length; index++) {
                // console.log('columnheaders', columnHeaders);
                format = /^#/;
                console.log('test spec',format.test(columnHeaders[index]));
                if (format.test(columnHeaders[index])) {
                //   that.logger.info(logString + ' process rejected due to special characters in the column headers in the file.');
                  return sendBadRequest(res, {}, 'special_characters_headers');
                }
              }
              console.log('jsonArray',jsonArray);
              console.log( ' checking row loop start.');

              for (let index = 0; index < jsonArray.length; index++) {
                let element = jsonArray[index];
                //check special characters rows validation
                for (let i = 0; i < columnHeaders.length; i++) { 
                if (format.test(element[columnHeaders[i]])) {
                    //special characters not allowed
                    console.log( ' process rejected due to special characters in the file columns uploaded.');
                    return sendBadRequest(res, {}, 'special_characters_in the file');
                  }
                }
              }
              //checking for duplicates in loginids
              let isDuplicate;
              let loginIdsArr = jsonArray.map(value => value.login);
              isDuplicate = loginIdsArr.some(function (item, index) {
                return loginIdsArr.indexOf(item) != index
              });
              if(isDuplicate){
                console.log(' process rejected due to duplicate records for loginids in the files uploaded.');
                return sendBadRequest(res, {}, 'duplicate records for loginids in the files uploaded.');
              }
            //  checking for duplicates in loginids
              let idsArr = jsonArray.map(value => value.Id);
              isDuplicate = idsArr.some(function (item, index) {
                return idsArr.indexOf(item) != index
              });  
              if(isDuplicate){
                console.log(' process rejected due to duplicate records for ids in the files uploaded.');
                return sendBadRequest(res, {}, 'duplicate records for ids in the files uploaded.');
              }

            //now check if the details are there or not 
            // update
            let query ={
              Id:{$in:idsArr}
            }
            let usersExistsRes = await that.fileService.findManyEmployee(query);
            let onlyIdsArray = usersExistsRes.map(item=> {return item.Id});
            let filteredItemsAdd = jsonArray.filter(item => !onlyIdsArray.includes(item['Id']));
            let filteredItemsUpdate = jsonArray.filter(item => onlyIdsArray.includes(item['Id']));
            if(usersExistsRes){
              //then update
              await filteredItemsUpdate.forEach(async item => {
                  let updateFilter = { Id: item['Id'] };  
                  console.log('Each items - ', item);
                  let updateRes = await that.fileService.updateOne(updateFilter,item);
                  console.log('Ress- ', updateRes)
                });
                //and add the new items
                if(filteredItemsAdd.length >0)
                 await that.fileService.createUsers(filteredItemsAdd)
            }else{
              //no element add all elements
              await that.fileService.createUsers(jsonArray);
            }
            return sendAccepted(res, file, 'file_uploaded');
        })
        .catch(async function (error) {
            console.error('', error);
            return sendBadRequest(res, error.response, error.message);
        })
    }

    @Post('/user')
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'per_page', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    @ApiOperation({ summary: 'Get Employee listing data' })
    @ApiResponse({ status: 200, description: 'Employee data listed successful.' })
    async getAllEmployees(@Request() req, @Res() res: Response, @Query() query: any) {
      let that = this;
      const page = Number(query.page) > 0 ? Number(query.page) : 1;
        const perPage = Number(query.per_page) > 0 ? Number(query.per_page) : 10;
        const skip = Number((page - 1) * (perPage));
        let filters = {};
        if (query.keyword && query.keyword.trim() !== '') {
            const keyword = {
                $or: [
                    { name: { $regex: new RegExp('.*' + query.keyword + '.*', "i") } },
                    { login: { $regex: new RegExp('.*' + query.keyword + '.*', "i") } }
                ]
            }
            filters = Object.assign(filters, keyword);
        }
        await that.fileService.findAllEmployees(filters, skip, perPage)
          .then(async function (users) {
              // console.log( ' query result: ', users);
              const count = await that.fileService.count(filters);
              const pagination = {
                  total: count,
                  current_page: page,
                  per_page: perPage
              };
              // console.log( ' process end');
              return sendAccepted(res, { users, pagination: pagination }, 'employee data listed successfully.');
            })
          .catch(async function (error) {
                  console.error('Employee Listing::  error in catch block ', error);
                  return sendBadRequest(res, error.response, error.message);
            })
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Employee data' })
    @ApiResponse({ status: 200, description: 'Employee found successfully.' })
    async getOne(@Request() req, @Res() res: Response, @Param('id') employeeId: string) {
      let that = this;
        if (!isValidMongoId(employeeId)) {
            return sendBadRequest(res, {});
        }
        let filters = {
          _id: employeeId
        };
        that.fileService.findOneEmployee(filters)
            .then(async function (result) {
                if (!result) {
                    console.log(' employeeID:' + employeeId + ' not found');
                    return sendNotFound(res, {},'employee record not found.');
                }
                console.log( ' EmployeeId:' + employeeId + ' query completed');
                console.log( ' EmployeeId:' + employeeId + ' process end');
                return sendAccepted(res, result, 'employee listed successfully');
            })
            .catch(async function (error) {
                console.error( ' EmployeeID:' + employeeId + ' error in catch block ', error);
                return sendBadRequest(res, error.response, error.message);
            });
    }

    @Put(':id')
    @ApiBody({ type: UpdateUserDto })
    @ApiOperation({ summary: 'Update Employee data' })
    @ApiResponse({ status: 201, description: 'Employee Data Updated successfully.' })
    async update(@Body() userDto: UpdateUserDto, @Request() req, @Res() res: Response, @Param('id') employeeId: string) {
      let that = this;
      console.log('Employee update proces start.');
        // if (!isValidMongoId(employeeId)) {
        //     console.log('Employee Update:: invalid Campaign employeeId');
        //     return sendBadRequest(res, {});
        // }
        let filters = {
          _id:  employeeId
        };
      console.log('Employee update - ', filters);

        that.fileService.findOneEmployee(filters)
            .then(async function (employee) {
                if (!employee) {
                    console.log( ' employee not found');
                    return sendBadRequest(res, {}, 'employee not found');
                }

                let updated = await that.fileService.updateOne(filters, userDto);
                console.log(' process end', updated);
                return sendAccepted(res, {employee_id:employeeId}, 'employee_data_updated');
            })
            .catch(async function (error) {
                console.error(' error in catch block', error);
                return sendBadRequest(res, error.response, error.message);
            })
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Employee data' })
    @ApiResponse({ status: 204, description: 'Employee data deleted.' })
    async delete(@Request() req, @Res() res: Response,  @Param('id') employeeId: String) {
        let that = this;
        that.fileService.findOneEmployee({ "_id": employeeId }).then(async function (employee) {
          if (!employee) {
              console.log("Employee not found.");
              return sendBadRequest(res, {}, 'employee not found');
          }
          // console.log('  Employee data - ', employee);
          //status  - draft/ rejected or else give error
          const deleted = await that.fileService.delete({ _id: employeeId });
              if (deleted != null) {
                  console.log(' Employee data has been deleted.');
                  return sendAccepted(res, {}, 'employee data deleted');
              }
          return sendInternalServerError(res, {});
        }).catch(error => {
            return sendBadRequest(res, {}, error.message);
        });


    }

}
