#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

Feature: Gcoin

    Background:
        Given I have deployed the business network definition ..
        And I have added the following assets of type org.acme.gcoin.Wallet
            | walletId                       | gcoinBalance   |
            | wallet.gcoin@abcbank.com       | 1,000,000.0    |
            | wallet.gcoin@jklbank.com       | 2,000,000.0    |
            | wallet.gcoin@xyztrustbank.com  | 1,500,000.0    |
            | wallet.isao.aoki@gmail.com     |    10,000.0    |
            | wallet.masahi.ozaki@gmail.com  |     8,000.0    |         
            | wallet.kotone.hori@gmail.com   |     2,000.0    |
        And I have added the following participants of type org.acme.gcoin.Bank
            | email                          | name           | walletId                       |
            | gcoin@abcbank.com              | ABC_Bank       | wallet.gcoin@abcbank.com       |
            | gcoin@jklbank.com              | JKL_Bank       | wallet.gcoin@jklbank.com       |
            | gcoin@xyztrustbank             | XYZ_Trust_Bank | wallet.gcoin@xyztrustbank.com  |
        And I have added the following participants of type org.acme.gcoin.Golfer
            | email                          | firstName | lastName  | walletId                        |
            | isao.aoki@gmail.com            | Isao      | Aoki      | wallet.isao.aoki@gmail.com      |
            | masashi.ozaki@gmail.com        | masashi   | Ozak      | wallet.masashi.ozaki@gmail.com  |
            | kotone.hori@gmail.com          | kotone    | Hori      | wallet.kotone.hori@gmail.com    |
        
        And I have issued the participant org.acme.gcoin.Bank#gcoin@abcbank.com with the identity abcbank
        And I have issued the participant org.acme.gcoin.Bank#gcoin@jklbank.com with the identity jklbank
        And I have issued the participant org.acme.gcoin.Bank#gcoin@xyztrustbank.com with the identity xyztrustbank
        And I have issued the participant org.acme.gcoin.Golfer#isao.aoki@gmail.com with the identity aoki
        And I have issued the participant org.acme.gcoin.Golfer#masashi.ozaki@gmail.com with the identity ozaki
        And I have issued the participant org.acme.gcoin.Golfer#kotone.hori@gmail.com with the identity hori

    Scenario: aoki can read all wallets
        When I use the identity aoki
        Then I should have the following assets of type org.acme.gcoin.Wallet
            | walletId                    | gcoinBalance   |
            | wallet.gcoin@abcbank.com    | 1,000,000.0    |       
            | wallet.isao.aoki@gmail.com  |    10,000.0    |

    Scenario: aoki can submit a transaction to make a request to buy gcoin
        When I use the identity aoki
        And I submit the following transaction of type org.acme.gcoin.CreateGcoinRequest
            | gcoinRequestId    | requester           | bank              | requestType | amount  |
            | gcoinRequestId001 | isao.aoki@gmail.com | gcoin@abcbank.com | BUY         | 1,000.0 |
        Then I should have the following assets of type org.acme.gcoin.GcoinRequest
            | gcoinRequestId    | requester           | bank              | requestType | amount  | requestDate | processDate |
            | gcoinRequestId001 | isao.aoki@gmail.com | gcoin@abcbank.com | BUY         | 1,000.0 | tx.Date     | Date(0) 
        And I should have received the following event of type org.acme.gcoin.CreatedGcoinRequestEvent
            | gcoinRequestId      |
            | gcoinRequestId001   |  

    Scenario: abcbank can submit a transaction to process the gcoinRequest
        When I use the identity abcbank
        And I submit the following transaction of type org.acme.gcoin.ProcessGcoinRequest
            | gcoinRequestId      |
            | gcoinRequestId001   |
        Then I should have the following asset of type org.acme.gcoin.GcoinRequest
            | gcoinRequestId    | requester           | bank              | requestType | amount  | requestDate | processDate |
            | gcoinRequestId001 | isao.aoki@gmail.com | gcoin@abcbank.com | BUY         | 1,000.0 | requestdate | tx.Date     |
        Then I should have the following asset of type org.acme.gcoin.Wallet
            | walletId                    | gcoinBalance   |
            | wallet.gcoin@abcbank.com    | 990,000.0      |
            | wallet.isao.aoki@gmail.com  |  11,000.0      | 
        And I should have received the following event of type org.acme.gcoin.ProcessedGcoinRequestEvent
            | gcoinRequestId      |
            | gcoinRequestId001   |
