/**
 * NEW FILE: src/playbook/content.en.ts
 * -----------------------------------------------------------------------
 * English playbook content. This is the same content that used to live
 * in src/playbook/content.ts, moved here unchanged. The old content.ts
 * is now a dispatcher (see playbook-content-dispatcher.ts artifact).
 * -----------------------------------------------------------------------
 */
import type {
    PlaybookBlock,
    PlaybookQuickAccessItem,
  } from "@/types/playbook";
  
  export const playbookBlocks: PlaybookBlock[] = [
    {
      key: "why-tiktok-bans-happen",
      position: 1,
      title: "Why TikTok Bans Happen",
      description:
        "Understand the restriction you received before deciding what to do next.",
      topics: [
        {
          key: "types-of-restrictions",
          title: "Types of restrictions",
          quickAnswer:
            "The course separates several situations: a warning, a LIVE being terminated, LIVE access being restricted, an account suspension or ban, and a sudden visibility drop.",
          steps: [
            "Check whether TikTok displayed a warning or violation notification.",
            "Check whether the LIVE was stopped.",
            "Check whether LIVE access is still available.",
            "Check whether the restriction affects the whole account.",
            "Save the notification so you can identify the reason and duration.",
          ],
          scenarios: [
            "You receive a warning but the LIVE remains available.",
            "The current LIVE is terminated.",
            "LIVE access becomes unavailable for a period of time.",
            "The account is suspended or banned.",
            "Reach drops suddenly without a clear notification.",
          ],
          importantDetails: [
            "Do not treat every problem as the same type of restriction.",
            "The first goal is to identify what TikTok actually changed on the account.",
          ],
        },
        {
          key: "warning-vs-live-restriction-vs-account-ban",
          title: "Warning vs. LIVE restriction vs. account ban",
          quickAnswer:
            "The course treats a warning, loss of LIVE access, and an account-level suspension or ban as different outcomes. Check the notification and the features that remain available before taking action.",
          steps: [
            "Open the violation or restriction notification.",
            "Check whether the current LIVE ended.",
            "Check whether you can still start another LIVE.",
            "Check whether the rest of the account remains usable.",
            "Record the stated reason and restriction duration.",
          ],
          importantDetails: [
            "The course does not provide one universal recovery action for every restriction type.",
            "Use the actual notice and current account status as the starting point.",
          ],
        },
        {
          key: "visibility-restrictions",
          title: "Visibility restrictions",
          quickAnswer:
            "A sudden drop in visibility or reach is treated as a separate signal to investigate, especially when there is no obvious account-ban notification.",
          steps: [
            "Check for any new warning or violation notification.",
            "Check whether LIVE access is still available.",
            "Record what changed and when it happened.",
            "Review the setup used during the affected LIVE before the next stream.",
          ],
          importantDetails: [
            "The provided material does not define a guaranteed diagnostic test for reduced reach.",
            "Document the incident instead of assuming the cause.",
          ],
        },
        {
          key: "identify-the-reason",
          title: "How to identify the reason",
          quickAnswer:
            "Start with TikTok's own notification: capture it, identify the stated reason, check the restriction duration, and record what was happening during the LIVE.",
          steps: [
            "Open the TikTok notification.",
            "Take a screenshot.",
            "Identify the violation reason shown in the notice.",
            "Check the restriction duration or expiration date when one is shown.",
            "Record what happened during the LIVE so the incident can be reviewed later.",
          ],
          scenarios: [
            "The notification gives a clear reason and duration.",
            "The LIVE stopped, but you still need to verify whether LIVE access remains available.",
            "Reach dropped without an obvious notification, so the incident needs to be documented for review.",
          ],
        },
      ],
    },
    {
      key: "avoid-tiktok-bans-during-lives",
      position: 2,
      title: "How to Avoid TikTok Bans During Lives",
      description:
        "Prepare the screen, wording, and LIVE structure before you start streaming.",
      topics: [
        {
          key: "what-you-show-on-screen",
          title: "What you show on screen",
          quickAnswer:
            "Keep the LIVE focused on the chart and trading area. The recorded course advises avoiding unnecessary broker branding, unnecessary platform interface elements, and cluttered on-screen text.",
          steps: [
            "Prepare the trading chart and terminal before the LIVE.",
            "Review what balance, trade amounts, trading results, broker branding, Notes, and links are visible.",
            "Remove unnecessary platform-interface elements from the visible area.",
            "Keep the screen visually active while you explain the chart instead of leaving it completely static for long periods.",
          ],
          scenarios: [
            "A clean chart-focused layout where the explanation remains the main visual content.",
            "A cluttered terminal view that exposes unnecessary interface elements and should be cleaned up before going LIVE.",
          ],
          importantDetails: [
            "The speaker material specifically recommends focusing primarily on the chart / trading area.",
            "Review account balance, trade amounts, trading results, broker name/logo, Notes, and links as part of screen preparation.",
          ],
        },
        {
          key: "what-you-say-during-a-live",
          title: "What you say during a LIVE",
          quickAnswer:
            "Frame the LIVE as educational content: explain what you see and why. The course also calls out broker/platform mentions, money and profit claims, Telegram, and registration questions as wording that should be prepared in advance.",
          steps: [
            "Prepare how you will describe the trading setup and results.",
            "Avoid guaranteed-profit wording.",
            "Prepare answers to questions about the broker and registration instead of improvising under pressure.",
            "Use the approved Notes setup for external-platform information rather than repeatedly telling viewers to leave TikTok for Telegram.",
          ],
          scenarios: [
            "Instead of a bare command such as 'buy now', explain the chart logic behind the trade.",
            "When a viewer asks how to start, explain the next step only after there is context and genuine interest.",
          ],
          importantDetails: [
            "The course distinguishes educational explanation from signal-style commands without context.",
            "How to talk about money, profits, Telegram, and registration is part of the pre-LIVE communication plan.",
          ],
        },
        {
          key: "how-you-run-the-live",
          title: "How you run the LIVE",
          quickAnswer:
            "Run an active, educational LIVE: explain the chart, interact with viewers, show the real flow of trading, and keep the presentation moving instead of leaving a repetitive static screen.",
          steps: [
            "Open with a short introduction and viewer interaction.",
            "Move into educational chart explanations.",
            "Explain the logic before a live trade instead of entering silently.",
            "React calmly to both winning and losing trades.",
            "Keep asking viewers questions so the LIVE remains interactive.",
          ],
          scenarios: [
            "Explain a support level or pattern and ask viewers whether they can see it.",
            "If a trade loses, explain that losses are part of trading and continue the process calmly.",
          ],
          importantDetails: [
            "The recorded lesson uses a four-part LIVE structure: opening, educational content, live trade, closing.",
            "The material emphasizes streaming consistency and genuine interaction with viewers.",
          ],
        },
        {
          key: "pre-live-safety-checklist",
          title: "Pre-LIVE Safety Checklist",
          quickAnswer:
            "Complete one final check of the TikTok account, visible trading screen, Notes, technical setup, and terminal before pressing Go LIVE.",
          steps: [
            "Check the TikTok account status and LIVE access.",
            "Prepare the trading screen and terminal.",
            "Review visible balance, trading results, broker branding, Notes, links, and other on-screen text.",
            "Check audio, internet, battery, and equipment.",
            "Confirm the terminal is already configured before the LIVE starts.",
            "Do the final readiness check and only then start the LIVE.",
          ],
          importantDetails: [
            "One recorded lesson recommends at least 80% battery or connecting the charger before the stream.",
            "The course uses a two-device setup: the trading terminal on one device and TikTok LIVE on another.",
            "Internet should be checked before the stream, not after it has already started.",
          ],
          checklist: {
            title: "Pre-LIVE Safety Checklist",
            description:
              "The finalized practical checklist combines screen preparation and the final technical check into one tool.",
            items: [
              "TikTok account status checked",
              "LIVE access checked",
              "Trading screen and terminal prepared",
              "Balance and trading results reviewed",
              "Broker branding and on-screen text reviewed",
              "Notes and links reviewed",
              "Audio working",
              "Internet connection checked",
              "Battery and equipment ready",
              "Trading terminal configured",
              "Final readiness check completed",
            ],
          },
        },
      ],
    },
    {
      key: "what-to-do-if-banned",
      position: 3,
      title: "What to Do if Your TikTok Account Gets Banned During a Live",
      description:
        "Document the incident, follow the available recovery path, and return only after access is restored.",
      topics: [
        {
          key: "identify-what-happened",
          title: "Identify what happened",
          quickAnswer:
            "First identify the exact outcome: warning, terminated LIVE, restricted LIVE access, account suspension/ban, or a sudden visibility drop.",
          steps: [
            "Read the restriction notification.",
            "Check whether the LIVE was terminated.",
            "Check whether LIVE access remains available.",
            "Check whether the whole account is affected.",
            "Save the notice and restriction details.",
          ],
        },
        {
          key: "immediate-actions",
          title: "Immediate actions",
          quickAnswer:
            "Do not guess. Open the notice, save evidence, record the reason and duration, and document what was happening during the LIVE.",
          steps: [
            "Open the TikTok notification.",
            "Take a screenshot.",
            "Identify the violation reason.",
            "Check the restriction duration.",
            "Record what happened during the LIVE.",
            "Correct the setup before the next LIVE based on what you found.",
          ],
          importantDetails: [
            "The speaker material recommends asking Academy Experts for help when needed.",
          ],
        },
        {
          key: "submit-an-appeal",
          title: "How to submit an appeal",
          quickAnswer:
            "When an appeal is available, start from the violation notification, open the appeal option, submit the requested information, and track the appeal status.",
          steps: [
            "Find the violation notification.",
            "Check whether an appeal option is available.",
            "Open the appeal flow.",
            "Provide the information requested in the appeal.",
            "Track the appeal status.",
          ],
          sourceNote:
            "The provided course material does not contain a detailed button-by-button TikTok appeal walkthrough, so this page does not invent one.",
        },
        {
          key: "while-account-is-restricted",
          title: "While your account is restricted",
          quickAnswer:
            "Check which account features are still available, address the issue named in the notice, keep the audience connection through your existing community, and wait until the account is permitted to resume streaming.",
          steps: [
            "Check which account features remain available.",
            "Address the issue identified in the restriction notice.",
            "Maintain communication with your audience through your existing community.",
            "Track the restriction period and account status.",
            "Prepare the next LIVE only after reviewing the issue that caused the restriction.",
          ],
          importantDetails: [
            "The course material distinguishes account management from intentionally bypassing an active restriction with another account.",
            "A resting period by itself is not presented as a guaranteed way to remove a restriction.",
          ],
        },
        {
          key: "return-to-streaming",
          title: "How to return to streaming",
          quickAnswer:
            "Return only after LIVE access is restored. Recheck the account, complete the safety checklist again, prepare the next stream, and then resume.",
          steps: [
            "Check whether LIVE access has been restored.",
            "Check the current account status.",
            "Complete the Pre-LIVE Safety Checklist again.",
            "Prepare the next LIVE with the corrected setup.",
            "Resume streaming when permitted.",
            "Report the incident to Academy Experts when the course process requires it.",
          ],
        },
      ],
    },
    {
      key: "account-rotation-strategy",
      position: 4,
      title: "TikTok Account Rotation Strategy",
      description:
        "Prepare main and backup accounts so one account problem does not stop the entire streaming workflow.",
      topics: [
        {
          key: "why-you-need-account-strategy",
          title: "Why you need an account strategy",
          quickAnswer:
            "Relying on one TikTok account creates a single point of failure. The course recommends preparing backup accounts and keeping the audience connection through Telegram so streaming can recover from account problems.",
          importantDetails: [
            "Backup accounts are presented as continuity tools, not as a guarantee against restrictions.",
            "Telegram is part of the continuity strategy because the audience connection can remain outside the affected TikTok account.",
          ],
        },
        {
          key: "how-many-accounts",
          title: "How many accounts you need",
          quickAnswer:
            "The finalized course structure uses one Main Account, Backup Account 1, Backup Account 2, and additional accounts when needed.",
          importantDetails: [
            "The recorded speakers describe different setups, ranging from one to three backup accounts.",
            "The source explicitly says not to silently merge those different speaker recommendations into a made-up single method.",
          ],
          sourceNote:
            "There is no single speaker-independent number finalized in the provided material beyond the course structure of a main account plus two named backups and optional additional accounts.",
        },
        {
          key: "account-roles-and-setup",
          title: "Account roles and setup",
          quickAnswer:
            "Define which account is the Main Account and which are backups, then keep a consistent streamer identity, profile naming, links, access, and security across the setup.",
          steps: [
            "Identify the Main Account.",
            "Identify Backup Account 1 and Backup Account 2.",
            "Keep the streamer identity consistent across accounts.",
            "Review profile names, branding, and links.",
            "Record account access and security details.",
          ],
        },
        {
          key: "rotation-and-resting",
          title: "Rotation and resting",
          quickAnswer:
            "Use planned rotation and resting as account-management tools: track warnings and restrictions, know which account is active, and only return an affected account when its status allows it.",
          steps: [
            "Track which account is currently active.",
            "Record warnings and restrictions for each account.",
            "Record resting periods where they are part of the speaker's method.",
            "Check LIVE access before returning an account to streaming.",
          ],
          importantDetails: [
            "The recorded modules contain different rotation/resting methods from different speakers.",
            "The Playbook preserves those differences instead of pretending there is one universal method.",
            "Resting an account is not presented as automatically removing an active restriction.",
          ],
        },
        {
          key: "account-tracking",
          title: "Account tracking",
          quickAnswer:
            "Keep a simple account tracker so you always know the role, status, LIVE access, warning history, last LIVE date, and next action for each account.",
          steps: [
            "Record the account name and role.",
            "Record whether the account is active, restricted, or inactive.",
            "Record whether LIVE access is available.",
            "Record previous warnings and restrictions.",
            "Record the last LIVE date.",
            "Record the next planned activity or permitted action.",
          ],
        },
        {
          key: "practical-examples",
          title: "Practical examples",
          quickAnswer:
            "Use the account strategy to handle four recurring situations: a normal streaming day, a warning, temporary loss of LIVE access, and a return to normal operations.",
          scenarios: [
            "Regular day: identify the active account, confirm LIVE access, and record the last/next activity.",
            "Warning: document the notice and update that account's status before planning the next LIVE.",
            "Temporary loss of LIVE access: keep the affected account status visible in the tracker and follow the restriction/recovery process.",
            "Return to normal operations: confirm access is restored and complete the pre-LIVE checks again.",
          ],
        },
      ],
    },
    {
      key: "where-to-buy-tiktok-accounts",
      position: 5,
      title: "Where to Buy TikTok Accounts",
      description:
        "Compare creating and warming up your own account with buying an existing account, then inspect the account before purchasing.",
      topics: [
        {
          key: "create-and-warm-up-vs-buy",
          title: "Create & warm up vs. buy",
          quickAnswer:
            "The course presents two routes: create and warm up your own TikTok account, or buy an existing account. Creating takes more time; buying may be faster but requires careful checks of the account's history and access.",
          scenarios: [
            "Create & Warm Up: more preparation time, but you control the account history and streamer identity from the start.",
            "Buy Existing: potentially faster access to an established account, but the history, previous violations, seller, and recovery access need to be checked.",
          ],
        },
        {
          key: "buying-pros-and-cons",
          title: "Pros and cons",
          quickAnswer:
            "Creating gives you more control over the account history but takes time. Buying can give faster access to an established account, but comes with history, seller, ownership, and recovery risks that must be checked.",
          importantDetails: [
            "Create & warm up: preparation time, control over history, streamer identity, LIVE access, costs and limitations.",
            "Buy existing: speed, existing LIVE access, account age/history, previous violations, seller and recovery risks.",
          ],
        },
        {
          key: "where-to-find-accounts",
          title: "Where to find accounts",
          quickAnswer:
            "The course refers to TikTok account marketplaces, sellers mentioned by speakers, and recommendations from other streamers. The supplied material does not contain a finalized marketplace name to publish here.",
          steps: [
            "Start from a marketplace or seller source used in the course material.",
            "Check the seller's credibility before evaluating the account itself.",
            "Do not skip the account verification checklist just because the source was recommended.",
          ],
          sourceNote:
            "The recorded script contains a placeholder for the marketplace name, so the Playbook intentionally does not invent one.",
        },
        {
          key: "what-to-check-before-buying",
          title: "What to check before buying",
          quickAnswer:
            "Before buying, verify age, region, followers, LIVE access, account history, content history, ownership/recovery access, and price.",
          steps: [
            "Check when the account was created.",
            "Check whether the region matches the target audience.",
            "Check follower count and whether LIVE access is actually enabled.",
            "Review previous warnings, bans, restrictions, and content history.",
            "Confirm ownership and recovery access.",
            "Compare the price with what is actually included.",
          ],
          importantDetails: [
            "One recorded speaker recommends an account age of at least 6 months.",
            "The same speaker recommends at least 1,000 followers and LIVE enabled.",
            "The speaker describes ready-made accounts as costing around $3–$10.",
            "These numbers are speaker recommendations from the recorded course material, not a universal platform guarantee.",
          ],
        },
        {
          key: "purchase-walkthrough",
          title: "Purchase walkthrough",
          quickAnswer:
            "Review the listing, verify the key account parameters, identify red flags, and decide whether the account should be accepted or rejected.",
          steps: [
            "Open the account listing.",
            "Check age, region, followers, and LIVE access.",
            "Review history, restrictions, and previous content.",
            "Check ownership and recovery access.",
            "Identify anything that does not match the listing or your target audience.",
            "Decide whether to proceed or reject the offer.",
          ],
        },
        {
          key: "buying-checklist",
          title: "Buying checklist",
          quickAnswer:
            "Use this checklist before every purchase so the decision is based on the account's real parameters, not only on the seller's description.",
          importantDetails: [
            "The final course package includes this as one of the three standalone practical checklists.",
          ],
          checklist: {
            title: "TikTok Account Buying Checklist",
            description:
              "A practical account-verification checklist to complete before purchasing.",
            items: [
              "Account age checked",
              "Region checked against the target audience",
              "Follower count checked",
              "LIVE access confirmed",
              "Previous bans, warnings, and restrictions reviewed",
              "Account activity and content history reviewed",
              "Seller credibility checked",
              "Ownership and recovery access confirmed",
              "Price reviewed",
            ],
            note:
              "Speaker example: at least 6 months old, at least 1,000 followers, LIVE enabled, and roughly $3–$10 for ready-made accounts.",
          },
        },
      ],
    },
    {
      key: "tiktok-warm-up-strategy",
      position: 6,
      title: "TikTok Warm-Up Strategy",
      description:
        "Prepare a new or acquired account before its first LIVE using the warm-up sequence described in the recorded lesson.",
      topics: [
        {
          key: "what-is-warm-up",
          title: "What is warm-up",
          quickAnswer:
            "Warm-up is the preparation period before the first LIVE. The recorded lesson describes using the account normally around relevant trading content instead of immediately starting to stream.",
          importantDetails: [
            "The recorded speaker describes a warm-up period of around 1–2 days.",
            "That timing is presented as the speaker's method, not as a guaranteed TikTok requirement.",
          ],
        },
        {
          key: "account-preparation",
          title: "Account preparation",
          quickAnswer:
            "Before warm-up and the first LIVE, complete the profile, establish the streamer identity, secure the account, and confirm LIVE access.",
          steps: [
            "Complete the profile.",
            "Set a consistent streamer identity.",
            "Set up account security and access.",
            "Check whether LIVE access is available.",
          ],
        },
        {
          key: "warm-up-activities",
          title: "Warm-up activities",
          quickAnswer:
            "The recorded lesson starts with normal viewing behavior around trading content, then adds genuine engagement such as likes, comments, and follows before moving toward regular content activity.",
          steps: [
            "Open TikTok and search for trading-related content.",
            "Watch relevant trading videos; the recorded example says about 20–30 minutes during the initial period.",
            "During the next stage, like content, write comments, and follow trading accounts.",
            "Do not post immediately during the early warm-up stage described by the speaker.",
            "Later, develop normal account activity and original content as the account preparation continues.",
          ],
          importantDetails: [
            "The speaker describes the first 1–2 hours as viewing/search activity.",
            "The next 2–3 hours add likes, comments, and follows.",
            "In the evening, the speaker recommends browsing the feed normally.",
          ],
        },
        {
          key: "warm-up-timeline",
          title: "Warm-up timeline",
          quickAnswer:
            "The recorded method lasts around 1–2 days. The detailed timing is strongest for the initial hours; the source does not provide a separate minute-by-minute Day 2 schedule.",
          steps: [
            "Initial 1–2 hours: open the app, search for trading, and watch trading-related content.",
            "Within that viewing period, the speaker gives an example of watching videos for 20–30 minutes.",
            "Next 2–3 hours: like content, write comments, follow trading accounts, and do not post yet.",
            "In the evening: browse the feed normally.",
            "Continue the warm-up period until the account is ready for the first LIVE; the recorded lesson describes the total period as around 1–2 days.",
          ],
          sourceNote:
            "The source does not give an exact standalone Day 2 timetable, so the Playbook does not fabricate one.",
        },
        {
          key: "first-live-readiness",
          title: "First LIVE readiness",
          quickAnswer:
            "Before the first LIVE, confirm LIVE access, check the account status, review the profile and content, prepare the broadcast, and complete the final safety checks.",
          steps: [
            "Confirm LIVE access.",
            "Check the account status.",
            "Review the profile and content.",
            "Prepare the first broadcast and terminal setup.",
            "Complete the Pre-LIVE Safety Checklist.",
          ],
          importantDetails: [
            "The recorded warm-up lesson uses the feed becoming naturally aligned with trading content as one practical readiness signal.",
          ],
        },
        {
          key: "warm-up-plan",
          title: "Warm-up plan",
          quickAnswer:
            "Use the speaker's 1–2 day warm-up sequence as an execution plan, then finish with a first-LIVE readiness check.",
          sourceNote:
            "The source gives exact actions for the initial hours but does not contain a separate detailed Day 2 schedule.",
          checklist: {
            title: "TikTok Account Warm-Up Plan",
            description:
              "The finalized practical tool turns the recorded warm-up method into a chronological plan.",
            items: [
              "Profile completed and account access secured",
              "LIVE access checked",
              "Initial trading-content search completed",
              "Relevant trading content watched",
              "Likes, comments, and follows added during the next warm-up stage",
              "No immediate posting during the early stage described by the speaker",
              "Normal feed browsing completed",
              "Account status checked again before the first LIVE",
              "Pre-LIVE Safety Checklist completed",
            ],
            note:
              "Speaker timeline: around 1–2 days total; initial 1–2 hours focused on viewing/search, followed by 2–3 hours of engagement, then normal evening browsing.",
          },
        },
      ],
    },
  ];
  
  export const playbookQuickAccess: PlaybookQuickAccessItem[] = [
    {
      key: "pre-live",
      label: "Pre-LIVE",
      blockKey: "avoid-tiktok-bans-during-lives",
      topicKey: "pre-live-safety-checklist",
    },
    {
      key: "buying",
      label: "Buying",
      blockKey: "where-to-buy-tiktok-accounts",
      topicKey: "buying-checklist",
    },
    {
      key: "warm-up",
      label: "Warm-Up",
      blockKey: "tiktok-warm-up-strategy",
      topicKey: "warm-up-plan",
    },
  ];
  