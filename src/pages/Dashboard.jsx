import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

import axios from "axios";
import "./Dashboard.css";
import { Dropdown, Form, Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import DatePicker from "react-datepicker";
import ReactFlagsSelect from "react-flags-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Toolbar,
  Table,
  TableHeaderRow,
  SearchPanel,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const Dashboard = () => {
  const [spots, setSpots] = useState([]);
  const [selected, setSelected] = useState({});
  const [pageSizes] = useState([5, 10, 15, 0]);
  const [pageSize, setPageSize] = useState(5);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [month, setMonth] = useState("");
  const [probability, setProbability] = useState(0);

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
  });
  const [isNewLocationVisible, setIsNewLocationVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [date, setDate] = useState(new Date());

  const [columns] = useState([
    { name: "name", title: "Name" },
    { name: "country", title: "Country" },
    {
      name: "lat",
      title: "Latitude",
      getCellValue: (row) =>
        Math.round((Number(row.lat) + Number.EPSILON) * 100) / 100,
    },
    {
      name: "long",
      title: "Longitude",
      getCellValue: (row) =>
        Math.round((Number(row.long) + Number.EPSILON) * 100) / 100,
    },
    {
      name: "probability",
      title: "Wind Probability",
      getCellValue: (row) => row.probability + " %",
    },
    { name: "month", title: "When to go" },
  ]);

  const [defaultCenter, setDefaultCenter] = useState({
    lat: 41.3851,
    long: 2.1734,
  });
  const mapStyles = {
    height: "67vh",
    width: "100%",
  };

  useEffect(() => {
    getSpotsEndpointCall();
  }, []);

  const addNewSpot = async () => {
    const loc = {
      lat: location.lat,
      long: location.lng,
      country,
      probability,
      name,
      month,
      createdAt: new Date().toISOString(),
    };
    await addNewSpotEnpointCall(loc);
    setIsNewLocationVisible(false);
  };

  const getSpotsEndpointCall = async () => {
    const res = await axios.get(
      `https://623c6ee17efb5abea680cb7a.mockapi.io/spot`
    );
    toast.success("Spots loaded succesfully");
    setSpots(res.data);
    setDefaultCenter(res.data[0]);
  };

  const addNewSpotEnpointCall = async (spot) => {
    await axios.post(`https://623c6ee17efb5abea680cb7a.mockapi.io/spot`, spot);
    toast.success(`Spot called ${spot.name} was added with success`);

    await getSpotsEndpointCall();
  };

  return (
    <div>
      <div className="head-cotaier">
        {" "}
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h1 className="logo-h1">Kite</h1>
        <Dropdown>
          <Dropdown.Toggle
            style={{ borderRadius: "30px" }}
            variant="dark"
            id="dropdown-basic"
          >
            <FaUser />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/login">
              <IoIosLogIn /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/* <button>
          <img src={require("./Images/Logout.jpg")} />
        </button> */}
      </div>

      <LoadScript googleMapsApiKey="AIzaSyDElD1sPdm75PkUnqw30WL6zg5RG3d_pVc">
        <GoogleMap
          onClick={(e) => {
            setLocation({
              ...location,
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
            setIsNewLocationVisible(true);
          }}
          mapContainerStyle={mapStyles}
          zoom={2}
          center={
            !isNewLocationVisible
              ? {
                  lat: Number(defaultCenter.lat),
                  lng: Number(defaultCenter.long),
                }
              : undefined
          }
        >
          {spots.map((item) => {
            return (
              <Marker
                key={item.id}
                onClick={() => setSelected(item)}
                position={{ lat: Number(item.lat), lng: Number(item.long) }}
              />
            );
          })}

          {selected.id && (
            <InfoWindow
              position={{
                lat: Number(selected.lat),
                lng: Number(selected.long),
              }}
              clickable={true}
              onCloseClick={() => setSelected({})}
            >
              <div className="element-div">
                <h className="element-h">
                  <h4>{selected.name}</h4>
                  <h5>{selected.country}</h5>
                </h>
                <h className="element-space">
                  <h3>WIND PROBABILITY</h3>
                  <h3>{selected.probability}</h3>
                </h>
                <h className="element-space">
                  <h3>LATITUDE</h3>
                  <h3>{selected.lat} N</h3>
                </h>
                <h className="element-space">
                  <h3>LONGITUDE</h3>
                  <h3>{selected.long}</h3>
                </h>
              </div>
            </InfoWindow>
          )}

          {isNewLocationVisible && (
            <InfoWindow
              position={location}
              clickable={true}
              draggable={true}
              onCloseClick={() => setIsNewLocationVisible(false)}
            >
              <Form>
                {" "}
                <h4>Add new spot</h4>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Country</Form.Label>
                  <ReactFlagsSelect
                    selected={countryCode}
                    onSelect={(code) => {
                      setCountry(regionNames.of(code));
                      setCountryCode(code);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="month">
                  <Form.Label>When to go</Form.Label>
                  <DatePicker
                    selected={date}
                    showFullMonthYearPicker
                    dateFormat="MMMM"
                    showMonthYearPicker
                    onChange={(date) => {
                      setDate(date);
                      setMonth(date.toLocaleString("en", { month: "long" }));
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label>Probability: {probability} %</Form.Label>
                  <Form.Control
                    type="range"
                    placeholder="Probability"
                    min={0}
                    max={100}
                    onChange={(e) => setProbability(e.target.value)}
                    value={probability}
                  />
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                <hr />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="danger"
                    onClick={() => setIsNewLocationVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => addNewSpot()}>
                    Confirm
                  </Button>
                </div>
              </Form>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <div className="location-div">
        {" "}
        <h1 className="logo-h1">Locations</h1>
        <Grid rows={spots} columns={columns}>
          <SortingState
            defaultSorting={[{ columnName: "name", direction: "asc" }]}
          />{" "}
          <SearchState defaultValue="" />
          <Toolbar />
          <IntegratedSorting />
          <SearchPanel />
          <IntegratedFiltering />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
          <IntegratedPaging />
          <Table />
          <TableHeaderRow showSortingControls />
          <PagingPanel pageSizes={pageSizes} titleComponent={"Locations"} />
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
