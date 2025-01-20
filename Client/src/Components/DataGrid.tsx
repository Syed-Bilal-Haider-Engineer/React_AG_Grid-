import React, { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import URL from '../utils/URL';
import LoadingOverlay from '../Loader/Loading';
import useFetch from '../Hooks/useFetch';

import {CarTypes} from '../Types/Interface.ts';

import { 
  InputAdornment, 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Button 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from 'ag-grid-enterprise';
import styles from './DataGrid.module.css';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);


const columnsDef = (rowData: CarTypes[]) => {
  return Object.keys(rowData[0] || {}).filter((col) => col !== '_id');
};

export const DataGrid = () => {
  const navigate = useNavigate();
  const gridRef = useRef<AgGridReact>(null);

  const { data, loading: fetchLoading, refetch } = useFetch(`${URL}/api/car`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const DELAY = 1000;
  const gridTheme = 'ag-theme-balham';
  const isDarkMode = false;
  const gridHeight = null;

  const [rowData, setRowData] = useState<CarTypes[]>([]);
  const [columnsDefs, setColumnsDefs] = useState<string[] | undefined>();
  const [loading, setLoading] = useState(fetchLoading || false);
  const [searchValue, setSearchValue] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [minPrice, setMinPrice] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const debounceTimeout = useRef<any>(null);

  const themeClass = `${gridTheme}${isDarkMode ? '-dark' : ''}`;

  useEffect(() => {
    if (data?.length) {
      const columnsKey = columnsDef(data);
      setColumnsDefs(columnsKey);
      setRowData(data)
    }
  }, [data]);

  // Memoized column definitions
  const colDefs = useMemo(() => {
    const baseColumns = (columnsDefs || []).map((col) => ({
      field: col,
      headerName: col,
      type: 'leftAligned',
    }));

    const actionColumn = {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span
            style={{ padding: '0.2rem', cursor: 'pointer', color: 'green' }}
            onClick={() => navigate(`/view/${params.data._id}`)}
          >
            <VisibilityIcon />
          </span>
          <span
            style={{ padding: '0.2rem', cursor: 'pointer', color: 'red' }}
            onClick={() => handleDelete(params.data._id)}
          >
            <DeleteForeverIcon />
          </span>
        </div>
      ),
    };

    return [...baseColumns, actionColumn];
  }, [columnsDefs, navigate]);

  // Debounce function
  function debounce(func: any, delay: number) {
    return function (value: string) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        func(value);
        debounceTimeout.current = null;
      }, delay);
    };
  }

  // Search and filter functions
  const searchAPI = async (value: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/api/search?q=${value}`);
      setRowData(response?.data);
      const columnsKey = columnsDef(response?.data);
      setColumnsDefs(columnsKey);
    } catch (error: any) {
      console.error('Error during search:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        category: category || '',
      });

      const response = await fetch(`${URL}/api/filter?${params.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch filter results.');

      const data = await response.json();
      setRowData(data);
      const columnsKey = columnsDef(data);
      setColumnsDefs(columnsKey);
    } catch (error: any) {
      console.error('Error fetching filter results:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchAPI, DELAY);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSearch(value);
    setShowClearIcon(value !== '');
  };

  const handleClearSearch = () => {
    startTransition(() => {
     setSearchValue('');
     setShowClearIcon(false);
    })
    refetch()
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you want to delete this item?')) {
      setRowData((prev) => prev.filter((item: any) => item._id !== id));
    }
  };

  const handleFilterClick = () => {
    fetchFilterResults();
  };

  const clearFilter = () =>{
    startTransition(() => {
      setSearchValue('');
      setMinPrice('');
      setMaxPrice('');
      setCategory('');
    });
  
    refetch(); 
  }

  useEffect(() => {
    if (category) {
      fetchFilterResults();
    }
  }, [category]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', margin: 'auto', mt: 3 }}>
      {loading || fetchLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <LoadingOverlay />
        </Box>
      )}
      {/* Search and Filter */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search..."
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            endAdornment: showClearIcon && (
              <InputAdornment position="end">
                <ClearIcon onClick={handleClearSearch} sx={{ cursor: 'pointer' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: '95%', 
             borderRadius: '20px', 
             boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' }}
        />
        <Box sx={{ display: 'flex', gap: 2, width: '93%', alignItems:'center' }}>
          {/* Filter Fields */}
          <Box sx={{ display: 'flex', gap: 2, flex: 1, p: 2, boxShadow: 2, borderRadius: 2 }}>
            <TextField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                flex: 1,
                minWidth: 100
              }}
            />
            <TextField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                flex: 1,
                minWidth: 100
              }}
            />
            <Button variant="contained" sx={{backgroundColor:'#32cd32'}}
             onClick={handleFilterClick}>Go</Button>
          </Box>
          <Box sx={{ flex: 1,
             p: 2, boxShadow: 2, borderRadius: 2,gap:2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Tesla">Tesla</MenuItem>
                <MenuItem value="BMW">BMW</MenuItem>
                <MenuItem value="Audi">Audi</MenuItem>
                <MenuItem value="Honda">Honda</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" sx={{backgroundColor:'#32cd32', height:"75px"}}
           onClick={clearFilter}>Clear Filter</Button>
        </Box>
      </Box>
      {/* Data Grid */}
      <div
        style={gridHeight ? { maxHeight: gridHeight } : {}}
        className={`${themeClass} ${styles.grid}
         ${!gridHeight} ? ${styles.gridHeight} : ''`}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            flex: 1,
            sortable: true,
            resizable: true,
          }}
        />
      </div>
    </Box>
  );
};
