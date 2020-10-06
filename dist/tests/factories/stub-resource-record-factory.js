"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rosie_1 = require("rosie");
var stub_resource_record_1 = require("../stubs/stub-resource-record");
var factory_type_1 = require("./factory-type");
// -----------------------------------------------------------------------------------------
// #region Factory
// -----------------------------------------------------------------------------------------
var StubResourceRecordFactory = rosie_1.Factory.define(factory_type_1.FactoryType.StubResourceRecord, stub_resource_record_1.StubResourceRecord)
    .sequence("id", function (i) { return i; })
    .sequence("name", function (i) { return "Name " + i; });
exports.StubResourceRecordFactory = StubResourceRecordFactory;
// #endregion Export
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1Yi1yZXNvdXJjZS1yZWNvcmQtZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9mYWN0b3JpZXMvc3R1Yi1yZXNvdXJjZS1yZWNvcmQtZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFnQztBQUNoQyxzRUFBbUU7QUFDbkUsK0NBQTZDO0FBRTdDLDRGQUE0RjtBQUM1RixrQkFBa0I7QUFDbEIsNEZBQTRGO0FBRTVGLElBQU0seUJBQXlCLEdBQUcsZUFBTyxDQUFDLE1BQU0sQ0FDNUMsMEJBQVcsQ0FBQyxrQkFBa0IsRUFDOUIseUNBQWtCLENBQ3JCO0tBQ0ksUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLENBQVMsSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUM7S0FDaEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFDLENBQVMsSUFBSyxPQUFBLFVBQVEsQ0FBRyxFQUFYLENBQVcsQ0FBQyxDQUFDO0FBUXpDLDhEQUF5QjtBQUVsQyxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGYWN0b3J5IH0gZnJvbSBcInJvc2llXCI7XHJcbmltcG9ydCB7IFN0dWJSZXNvdXJjZVJlY29yZCB9IGZyb20gXCIuLi9zdHVicy9zdHViLXJlc291cmNlLXJlY29yZFwiO1xyXG5pbXBvcnQgeyBGYWN0b3J5VHlwZSB9IGZyb20gXCIuL2ZhY3RvcnktdHlwZVwiO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gI3JlZ2lvbiBGYWN0b3J5XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5jb25zdCBTdHViUmVzb3VyY2VSZWNvcmRGYWN0b3J5ID0gRmFjdG9yeS5kZWZpbmU8U3R1YlJlc291cmNlUmVjb3JkPihcclxuICAgIEZhY3RvcnlUeXBlLlN0dWJSZXNvdXJjZVJlY29yZCxcclxuICAgIFN0dWJSZXNvdXJjZVJlY29yZFxyXG4pXHJcbiAgICAuc2VxdWVuY2UoXCJpZFwiLCAoaTogbnVtYmVyKSA9PiBpKVxyXG4gICAgLnNlcXVlbmNlKFwibmFtZVwiLCAoaTogbnVtYmVyKSA9PiBgTmFtZSAke2l9YCk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIEZhY3RvcnlcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vICNyZWdpb24gRXhwb3J0XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5leHBvcnQgeyBTdHViUmVzb3VyY2VSZWNvcmRGYWN0b3J5IH07XHJcblxyXG4vLyAjZW5kcmVnaW9uIEV4cG9ydFxyXG4iXX0=