import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { parse as parseQS, stringify as stringifyQS } from 'query-string';
import DefaultDeck from './default-deck';
import PresenterMode from '../presenter-mode';
import PrintMode from '../../print-mode';
import useMousetrap from '../../hooks/use-mousetrap';
import { KEYBOARD_SHORTCUTS, SPECTACLE_MODES } from '../../utils/constants';
import { modeKeyForSearchParam, modeSearchParamForKey } from './modes';

export default function SpectacleDeck(props) {
  const [mode, setMode] = useState(
    modeKeyForSearchParam(
      parseQS(location.search, {
        parseBooleans: true
      })
    )
  );

  const toggleMode = useCallback(
    (e, newMode) => {
      e?.preventDefault();

      const { slideIndex, stepIndex } = parseQS(location.search, {
        parseBooleans: true
      });

      if (mode === newMode) {
        location.search = stringifyQS({
          slideIndex,
          stepIndex
        });
        return;
      }

      location.search = stringifyQS({
        slideIndex,
        stepIndex,
        ...modeSearchParamForKey(newMode)
      });
    },
    [mode]
  );

  useMousetrap(
    {
      [KEYBOARD_SHORTCUTS.PRESENTER_MODE]: e =>
        toggleMode(e, SPECTACLE_MODES.PRESENTER_MODE),
      [KEYBOARD_SHORTCUTS.PRINT_MODE]: e =>
        toggleMode(e, SPECTACLE_MODES.PRINT_MODE),
      [KEYBOARD_SHORTCUTS.OVERVIEW_MODE]: e =>
        toggleMode(e, SPECTACLE_MODES.OVERVIEW_MODE)
    },
    []
  );

  switch (mode) {
    case SPECTACLE_MODES.DEFAULT_MODE:
      return <DefaultDeck {...props} />;

    case SPECTACLE_MODES.PRESENTER_MODE:
      return <PresenterMode {...props} />;

    case SPECTACLE_MODES.PRINT_MODE:
      return <PrintMode {...props} />;

    case SPECTACLE_MODES.OVERVIEW_MODE:
      return <DefaultDeck overviewMode toggleMode={toggleMode} {...props} />;

    default:
      return null;
  }
}

SpectacleDeck.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object
};
