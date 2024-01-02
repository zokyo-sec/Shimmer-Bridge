/* eslint-disable react/no-unescaped-entities */
import {observer} from 'mobx-react';
import React from 'react';

import {Box, styled} from '@/core/ui/system';

const ScrollContainer = styled('div', {name: 'SlideInScrollContainer'})(({theme}) => ({
  overflowY: 'auto',
  flex: 1,
  '&::-webkit-scrollbar': {
    width: '1px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.text.secondary,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.text.secondary,
  },
}));

export const TermsOfServices = observer(() => {
  return (
    <ScrollContainer>
      <Box
        sx={{
          p: 2,
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box typography='p2' color='text.primary'>
          Last updated: 19 December 2023
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          Welcome to{' '}
          <Box component='a' href='https://shimmerbridge.org' color='primary.main' typography='p3'>
            https://shimmerbridge.org
          </Box>{' '}
          ("Shimmer Bridge" or "Service"), a website provided by the Tangle DAO LLC ("we," "us," or
          "our"), with its registered address at P.O. Box 401, Majuro, Marshall Islands 96960,
          Republic of the Marshall Islands and hosted by Zokyo FZCO in Dubai, UAE. The Service is
          provided to enable you to independently interact with the decentralised smart contract
          solutions built by LayerZero to bridge your crypto assets to and from the Shimmer network.
          These Terms of Service ("Terms") govern your use of the Service. Please read them
          carefully.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          PLEASE BE ADVISED THAT THE "DISPUTE RESOLUTION" SECTION (SECTION 10) OF THESE TERMS
          CONTAINS A BINDING ARBITRATION CLAUSE THAT PROHIBITS CLASS ACTION CLAIMS AND REQUIRES
          DISPUTES TO BE ARBITRATED INDIVIDUALLY. IT AFFECTS HOW DISPUTES BETWEEN YOU AND US ARE
          RESOLVED. YOU AGREE TO BE BOUND BY THIS ARBITRATION PROVISION BY ACCEPTING THESE TERMS.
          PLEASE READ THE DISPUTE RESOLUTION SECTION CAREFULLY.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          1. Acceptance of the Terms
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          By using the Service, you agree to be bound by these Terms. If you do not agree to all of
          these Terms, please do not use the Service.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          To use the Service, you must be above the age of majority in your country of residence
          (18+ in most jurisdictions) and have the full right, power, and authority to agree and
          comply with these Terms. You must not be subject to any economic or trade sanctions
          imposed by any governmental authority or be included in any list of restricted parties,
          jurisdictions or territories. You represent and confirm that your use of the Service
          adheres to all applicable laws and regulations and that you will not use the Service for
          any unlawful activities or activities that promote or facilitate illegal conduct.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          2. Description of Service
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          The Shimmer Bridge is built on LayerZero's wrapped asset bridge smart contract technology
          which empowers you to independently transfer and bridge your crypto-assets between
          different blockchain networks. We do not act as a broker or service provider on your
          behalf.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          You understand that by using the Service you are interacting directly with the smart
          contracts on the network and we do not facilitate or execute any transactions on your
          behalf. The Service is non-custodial and we do not have any control over your use of the
          Service. No fiduciary duty is created between you and us and we expressly disclaim, waive,
          and eliminate any fiduciary duties or liabilities to you or any other party.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          Your use of the Services is at your own risk and we are not liable for any damage or loss
          that you may suffer from any use of the Service, including due to market fluctuations,
          network congestion, or technical failures. We reserve the right to suspend or terminate
          access to the Service at any time, for any reason, without notice.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          3. Acceptance of Risks
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          Your use of the Services is at your own risk and we are not liable for any damage or loss
          that you may suffer from any use of the Service, including due to market fluctuations,
          network congestion, or technical failures. We reserve the right to suspend or terminate
          access to the Service at any time, for any reason, without notice.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          You agree and accept that we are not accountable for these risks, do not control your
          transactions, do not act on your behalf in any way and cannot assist you if the Service or
          the smart contracts fail to operate as intended. Consequently, you agree to assume full
          responsibility for all risks associated with accessing and using the Service.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          4. Your Responsibilities
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          You are solely responsible for your use of the Service. This means that:
          <ul>
            <li>
              You are solely responsible for safeguarding the cryptographic private keys to your
              digital asset wallets.
            </li>
            <li>
              You are solely responsible for maintaining the security of any software or devices you
              use to access your wallet and interact with the Service.
            </li>
            <li>
              You agree to comply with all applicable laws and regulations when using the Service.
            </li>
            <li>You must not use the Service for any illegal or unauthorised purpose.</li>
            <li>
              You must not engage in any harmful or illegal activity in relation to your use of the
              Service, including (i) any attempt to interfere with or compromise the integrity,
              security, or proper functioning of the Service or any related system or device,
              including the deployment of viruses and denial of service attacks (ii) any attempt to
              defraud or mislead any person; (iii) any infringement of any third-party intellectual
              property rights; and (iv) any other activity that violates any applicable laws or
              regulations or seeks to harm others.
            </li>
          </ul>
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          You explicitly acknowledge and accept all risks associated with accessing and using the
          Service and engaging with the smart contracts. Additionally, you expressly waive and
          discharge us from any liability, claims, causes of action, or damages arising from or
          connected to your use of the Service and interaction with the smart contracts.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          5. Intellectual Property
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          All content and materials available through the Service are the property of the Tangle DAO
          LLC or its licensors. You may not reproduce, distribute, or create derivative works
          without our prior written consent.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          6. Privacy
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          When you use the Service, the system uses trackers to process your blockchain wallet
          address and transaction information, in order to display the transaction status to you. No
          personal information (e.g., identifiable names) is gathered.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          Please note that, while using the Service, you are acting on the public blockchains and
          your activities are transparent, allowing anyone to view your transactions.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          7. Modifications to Terms
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          We may update or modify these Terms at any time. Any modifications will be effective when
          they are posted and it is your responsibility to review these Terms periodically. Your
          continued use of the Service after changes constitutes acceptance of the modified Terms.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          8. Disclaimer of Warranties
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          The Service is provided on an "as-is" and "as-available" basis. To the maximum extent
          permitted by law, we disclaim liability for any damages arising from the use of the
          Service, including indirect, incidental, punitive, exemplary, special, or consequential
          damages, even if advised of the possibility of such damages. Your use of the Service is at
          your sole risk, and we are not responsible for damages or losses resulting from your use,
          including changes to or termination of the site, delay, failure, unauthorised access,
          alteration of transmission or data, transactions, activities of third parties, or
          data/material accessed through the site. We make no warranties or representations about
          the accuracy or completeness of the site’s content or linked websites.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          9. Limitation of Liability
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          To the fullest extent permitted by law, we shall not be liable for any direct, indirect,
          incidental, special, consequential, or exemplary damages, including but not limited to,
          damages for loss of profits, goodwill, use, data, or other intangible losses.
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          We assume no liability for errors, mistakes, or inaccuracies; unauthorised access to
          secure servers and personal/financial information; interruption or cessation of
          transmission; bugs, viruses, or the like transmitted by third parties; or errors/omissions
          in content/materials. If dissatisfied with the site, your sole remedy is to discontinue
          your use of the Service. Some jurisdictions may not allow the exclusion or limitation of
          incidental or consequential damages, so these limitations/exclusions may not apply to you.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          10. Dispute Resolution and Class Action Waiver
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          10.1. Informal Resolution
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          In the event of any dispute, controversy, or claim arising out of or relating to these
          Terms or the use of the Shimmer Bridge ("Dispute"), you agree to first attempt to resolve
          the Dispute informally by contacting us at the contact information provided in these
          Terms. We will make good faith efforts to resolve the Dispute amicably within a reasonable
          time.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          10.2. Arbitration
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          If the Dispute cannot be resolved informally, you agree to resolve the Dispute through
          binding arbitration in accordance with the rules of JAMS Optional Expedited Arbitration
          Procedures. You understand that you are required to resolve all Disputes by binding
          arbitration. The arbitration shall be held on a confidential basis before a single
          arbitrator, who shall be selected pursuant to JAMS rules, the arbitration will be held in
          the Marshall Islands, unless you and we both agree to hold it elsewhere. The judgement
          upon the award rendered by the arbitrator may be entered in any court having jurisdiction
          thereof. The arbitration will be conducted in accordance with the laws of the Marshall
          Islands and shall take place in Majuro, Marshall Islands, unless otherwise agreed upon by
          the parties.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          10.3. Class Action Waiver
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          You agree that any arbitration or legal proceeding shall be limited to the Dispute between
          us individually. To the fullest extent permitted by applicable law, you agree that you may
          only bring claims against us in your individual capacity and not as a plaintiff or class
          member in any purported class or representative proceeding. Further, unless both you and
          we agree otherwise, the arbitrator may not consolidate more than one person's claims and
          may not otherwise preside over any form of a representative or class proceeding.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          11. Governing Law
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          These Terms are governed by and construed in accordance with the laws of the Marshall
          Islands, without regard to its conflict of law principles. You acknowledge and agree that
          while the Service may be accessible in other jurisdictions, its availability does not
          establish general or specific personal jurisdiction in any forum outside the Marshall
          Islands, and you agree that the Service is considered to be solely based in the Marshall
          Islands.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          12. Entire Agreement
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          These Terms constitute the entire agreement between you and us regarding this subject and
          replace any prior written or oral agreements related to the same.
        </Box>
        <br />
        <Box typography='p2' color='text.primary'>
          13. Contact Information
        </Box>
        <br />
        <Box typography='p2' color='text.secondary'>
          Tangle DAO LLC
        </Box>
        <Box typography='p2' color='text.secondary'>
          P.O. Box 401
          <br />
          Majuro
          <br />
          Marshall Islands 96960
          <br />
          Republic of the Marshall Islands
        </Box>
        <br />
        {/*<Box typography='p2' color='text.secondary'>*/}
        {/*  tangletreasury@gmail.com*/}
        {/*</Box>*/}
        <br />
        <Box typography='p2' color='text.secondary'>
          By using the Shimmer Bridge service, you agree to abide by these Terms. If you have any
          questions or concerns, please contact us at the provided contact address.
        </Box>
      </Box>
    </ScrollContainer>
  );
});
