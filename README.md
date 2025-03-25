## Webex Web SDK | Webex Click-to-call Demo

## Run this demo in your localhost

1. Clone this Repo
2. In js/app.js, set these variables
  a. Update `service_app_token` with the access token of the service app created for Click-to-Call
  b. Update `calledNumber` with the destination number you'd like to place the call to.
2. Do `yarn install`
3. Do `yarn start`
4. Navigate to [http://127.0.0.1:9000](http://127.0.0.1:9000)
5. Navigate to My Trips to start the click-to-call setup
6. Wait for a green circle icon to show up next to Harvey's avatar on the top-right corner of the screen.
   This indicates that we are registered with Webex Calling. If the green icon does not show up after
   waiting for 30-40 seconds, there might be an error registering with Webex Calling. Please check the
   console and network logs to determine what might be going wrong.
7. Click "Call Support" on the first item to place the call towards the destination set in Step 2b.

## Contact Us

### Support Spaces on Webex

- Webex SDK Contributors - https://eurl.io/#v-LbYXL27
- Chrome extension support space - https://eurl.io/#YbnG_BwcN


### Developer Support

- [Developer Support](https://developer.webex.com/support)
- [Developer Community](https://community.cisco.com/t5/webex-for-developers/bd-p/disc-webex-developers)
- [GitHub Repository Issues](https://github.com/webex/webex-js-sdk/issues) - (Issues, Q & A, Features)
- Email - devsupport@webex.com

### Webex Developers Beta Program

- [Go Beta - Webex Developers](https://gobeta.webex.com/key/dev-platform)

### Feature Requests

- Cisco Collab Aha - https://ciscocollaboration.ideas.aha.io/

## Documentation

### SDK Usage

- [Github Wiki](https://github.com/webex/webex-js-sdk/wiki)

#### Calling
- [Introducing the Webex Web Calling SDK](https://github.com/webex/webex-js-sdk/wiki/Introducing-the-Webex-Web-Calling-SDK)
- [Core Concepts](https://github.com/webex/webex-js-sdk/wiki/Core-Concepts-(Calling))
- [Quickstart guide](https://github.com/webex/webex-js-sdk/wiki/Quickstart-Guide-(Calling))
- [Authorization](https://github.com/webex/webex-js-sdk/wiki/Authorization-(Calling))
- **Basic Features**
  - [Incoming and outgoing calls](https://github.com/webex/webex-js-sdk/wiki/Incoming-and-Outgoing-Calls)
- **Advanced Features**
  - [Background Noise Removal](https://github.com/webex/webex-js-sdk/wiki/Webex-Calling-%7C-Background-Noise-Removal)
  - [Supplementary services](https://github.com/webex/webex-js-sdk/wiki/Calling-Supplementary-Services)
  - [Voicemail](https://github.com/webex/webex-js-sdk/wiki/Voicemail)
  - [Contacts](https://github.com/webex/webex-js-sdk/wiki/Contacts)
  - [Call History](https://github.com/webex/webex-js-sdk/wiki/Calling-Call-History)
  - [Call Settings](https://github.com/webex/webex-js-sdk/wiki/Call-Settings)
