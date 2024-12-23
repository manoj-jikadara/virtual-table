import React, { useMemo, useState } from "react";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserGrid = () => {
  const [columnDefs] = useState([
    { field: "firstName", flex: 1 },
    { field: "lastName", flex: 1 },
    { field: "email", flex: 2 },
    { field: "age", filter: "agNumberColumnFilter", flex: 1 },
    { field: "gender", flex: 1 },
    {
      field: "address.city",
      headerName: "City",
      flex: 1,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);

  const dataSource = {
    getRows: (params) => {
      const { startRow, endRow } = params;
      const limit = endRow - startRow;
      const skip = startRow;

      axios
        .get("https://dummyjson.com/users", {
          params: {
            skip,
            limit,
          },
        })
        .then((response) => {
          params?.successCallback(response?.data?.users, response?.data?.total);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          params?.failCallback();
        });
    },
  };

  return (
    <div style={{ height: "100vh" }}>
      <AgGridReact
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={30}
        paginationPageSizeSelector={[30, 50, 100]}
        cacheBlockSize={30}
        rowModelType="infinite"
        datasource={dataSource}
        infiniteInitialRowCount={30}
        rowSelection="multiple"
      />
    </div>
  );
};

export default UserGrid;
