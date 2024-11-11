/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";

function ExtensionRegistration() {
  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        headerMenu: {
          getButtons() {
            guestConnection.host.contentFragment.getContentFragment().then((e) => {
              if(!e.model.path.includes('product-teaser')) {
                console.log('here');
                return null;
              }
            });
            return [
              // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
              {
                id: 'select-book',
                label: 'Select Book',
                icon: 'OpenIn',
                variant: 'action',
                onClick() {
                  const modalURL = "/index.html#/select-book-modal";
                  console.log("Modal URL: ", modalURL);

                  guestConnection.host.modal.showUrl({
                    title: "Select Book",
                    url: modalURL,
                    height: 300,
                    width: 600,
                    isDismissable: true
                  });
                },
              },
            ];
          },
        },
      }
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default ExtensionRegistration;
