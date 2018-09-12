import { Button, EmptyState } from 'modules/common/components';
import { ModalFooter } from 'modules/common/styles/main';
import { MarkdownWrapper } from 'modules/settings/styles';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import { IIntegration } from '../../brands/types';

type Props = {
  integration: IIntegration
};

type State = {
  code: string,
  copied: boolean
};

class InstallCode extends Component<Props, State> {
  static contextTypes =  {
    closeModal: PropTypes.func.isRequired,
  }

  static installCodeIncludeScript(type) {
    return `
      (function() {
        var script = document.createElement('script');
        script.src = "${process.env.REACT_APP_CDN_HOST}/build/${
      type
    }Widget.bundle.js";
        script.async = true;

        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
      })();
    `;
  }

  static getInstallCode(brandCode) {
    return `
      <script>
        window.erxesSettings = {
          messenger: {
            brand_id: "${brandCode}",
          },
        };
        ${InstallCode.installCodeIncludeScript('messenger')}
      </script>
    `;
  }

  constructor(props, context) {
    super(props, context);

    let code = '';
    const integration = props.integration || {};

    // showed install code automatically in edit mode
    if (integration._id) {
      const brand = integration.brand || {};
      const form = integration.form || {};

      code = this.constructor().getInstallCode(brand.code, form.code);
    }

    this.state = {
      code,
      copied: false
    };
  }

  render() {
    return (
      <Fragment>
        <MarkdownWrapper>
          <ReactMarkdown source={this.state.code} />
          {this.state.code ? (
            <CopyToClipboard
              text={this.state.code}
              onCopy={() => this.setState({ copied: true })}
            >
              <Button size="small" btnStyle="primary" icon="copy">
                {this.state.copied ? 'Copied' : 'Copy to clipboard'}
              </Button>
            </CopyToClipboard>
          ) : (
            <EmptyState icon="copy" text="No copyable code" size="small" />
          )}
        </MarkdownWrapper>

        <ModalFooter>
          <Button
            btnStyle="simple"
            icon="cancel-1"
            onClick={() => this.context.closeModal()}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Fragment>
    );
  }
}

export default InstallCode;
