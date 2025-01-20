import {useParams, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
} from '@mui/material';
import URL, {imageURL} from '../utils/URL';
import LoadingOverlay from '../Loader/Loading';

export interface Car {
  _id: string;
  Brand: string;
  Model: string;
  AccelSec: number;
  TopSpeed_Km_h: number;
  Range_Km: number;
  Efficiency_Wh_km?: number;
  FastCharge_Km_h?: number;
  RapidCharge: string;
  PowerTrain: string;
  PlugType: string;
  BodyStyle: string;
  Segment: string;
  Seats: number;
  PriceEuro: number;
  Date?: string;
}

const ViewCar = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        try {
          const res = await fetch(`${URL}/api/car/${id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data: Car = await res.json();
          setCar(data);
        } catch (err) {
          console.error('Fetch Error:', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  return (
    <>
      {loading && (
        <Box sx={{display: 'flex', justifyContent: 'center', my: 2}}>
          <LoadingOverlay />
        </Box>
      )}
      <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            borderRadius: '20px',
            padding: '5px 15px',
          }}
        >
          Back
        </Button>

        <Card
          sx={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            height="300"
            image={imageURL}
            alt={`${car?.Brand} ${car?.Model}`}
          />
          <CardContent sx={{p: 4}}>
            <Typography variant="h4" gutterBottom>
              {car?.Brand} {car?.Model}
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              {car?.BodyStyle} - {car?.PowerTrain}
            </Typography>

            <Box
              sx={{
                background: '#f9f9f9',
                borderRadius: '8px',
                p: 3,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                mt: 3,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="h6">Top Speed:</Typography>
                  <Typography>{car?.TopSpeed_Km_h} km/h</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="h6">Acceleration (0-100):</Typography>
                  <Typography>{car?.AccelSec} seconds</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="h6">Range:</Typography>
                  <Typography>{car?.Range_Km} km</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="h6">Price:</Typography>
                  <Typography>€{car?.PriceEuro}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="h6">Plug Type:</Typography>
                  <Typography>{car?.PlugType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="h6">Seats:</Typography>
                  <Typography>{car?.Seats}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 4,
                borderRadius: '20px',
                padding: '10px 20px',
              }}
              disabled
            >
              Schedule Inspection
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default ViewCar;
