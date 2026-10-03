# store/

The app currently uses React Context (`src/context/`) for global state
(theme, chat open/close). This folder is reserved for a dedicated state
library (Zustand, Redux Toolkit, etc.) if/when the app's state grows beyond
what Context comfortably handles.
