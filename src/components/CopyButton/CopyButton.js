/*
* Copyright 2020 Acoustic, L.P.
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*/
import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

import Button from '../common/Button/Button';
import IconButton from '../common/IconButton/IconButton';
import formStyles from '../Form/Form.module.scss';

export default function CopyButton({ link }) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Copies the current link to the clipboard on click.
   *
   */
  const handleClick = () => {
    navigator.clipboard.writeText(link).then(() => setIsOpen(true));
  };

  /**
   * Sets the Snackar visibility to false.
   *
   */
  const handleClose = () => setIsOpen(false);

  return (
    <div className={formStyles.formGroup}>
      <div className={formStyles.formLabel}></div>
      <Button onClick={handleClick} caption="Copy" />
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        variant="success"
        open={isOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Link copied to clipboard"
        action={<IconButton onClick={handleClose} icon="clear" />}
      />
    </div>
  );
}
