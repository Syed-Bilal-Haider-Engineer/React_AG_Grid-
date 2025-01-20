# Aptitude Test for BMW IT Internship Position

## Goal
Create a **Generic DataGrid Component** using **AG Grid (React)** and integrate Backend Service.

## Library Links
- **React MUI**: [https://mui.com/](https://mui.com/)
- **React AG Grid**: [https://www.ag-grid.com/react-data-grid/getting-started/](https://www.ag-grid.com/react-data-grid/getting-started/)

Additionally, use React MUI for styling the application.

## Information
Use the attached dataset as a CSV file as test data for this Generic DataGrid app.

---

## Requirements

### 1. DataGrid Component
- The **DataGrid component** should be able to take any type of structural data having **N columns** and display it.
- The **DataGrid component** should have an **Actions** column by default, which can be used to add custom actions like:
  - **View**: View detailed information.
  - **Delete**: Delete a row, etc.

  On clicking the **View** button, the user should move to a new page displaying the details and provide a **Back** button to go back to the DataGrid component.

---

### 2. Search (Use Backend API)
- Add a **search feature** that can be used to search data and list the entries matching the search.

---

### 3. Filtering (Use Backend API)
- Add a **filter feature** to filter the contents in a particular column based on criteria like:
  - **Contains**
  - **Equals**
  - **Starts with**
  - **Ends with**
  - **Is empty**
  - ** etc**

---

### 4. Backend Service
- Create an API (**Express.js**) that will provide the data to the DataGrid component.

---

### How to Run the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/Syed-Bilal-Haider-Engineer/BWM_IT_Internship.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

4. Start the React app:
   ```bash
   cd client
   npm start
   ```
