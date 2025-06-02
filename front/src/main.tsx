import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from "react-router";
import { Link } from "react-router-dom";

import { createDsfrCustomBrandingProvider, createMuiDsfrThemeProvider } from "@codegouvfr/react-dsfr/mui";
import { createTheme, GlobalStyles } from '@mui/material';
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
startReactDsfr({ defaultColorScheme: "light", Link });

import Home from './pages/home/Home';
import Terms from './pages/terms/Terms';

import { Header } from './components/header/Header';

const { MuiDsfrThemeProvider } = createMuiDsfrThemeProvider({
});

const { DsfrCustomBrandingProvider } = createDsfrCustomBrandingProvider({
  createMuiTheme: () => {

    const theme = createTheme({
      palette: {
        text: {
          primary: '#000091', // Content-Brand-1-Accent
          secondary: '#000000', // Content-Brand-1
          disabled: '#595959', // Content-Brand-1-Disabled
        },
      },
      typography: {
        fontFamily: '"Marianne", sans-serif',
        h4: {
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: '28px', // 127.273%
        },
      }
    });

    return { theme };
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MuiDsfrThemeProvider>
      <DsfrCustomBrandingProvider>
        <BrowserRouter>
          <GlobalStyles
            styles={{
              "html": {
                "scrollBehavior": "smooth"
              },
              ".lasuite-gaufre-btn": {
                "box-shadow": "0px 0px 0px 0px inset !important"
              }
            }}
          />
          <div style={{ "minHeight": "100vh", "display": "flex", "flexDirection": "column" }}>
            <Header />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DsfrCustomBrandingProvider>
    </MuiDsfrThemeProvider>
  </StrictMode>,
)
