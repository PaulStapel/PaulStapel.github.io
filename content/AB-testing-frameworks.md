---
title: "A/B Testing Frameworks"
date: "2026-03-14T17:13:09+01:00"
draft: false
description: "Looking at some AB testing frameworks and considering pros and cons"
categories: 
    - coding
    - architecture
    - decision making
---

As I recently published an article on how A/B testing could be implemented for things like algorithms, I wanted to expand on this by also considering a few frameworks that can enable me to actually implement this in a robust way. I don't really like reinventing the wheel, and think it is wise to first look at solutions already available to me before deciding to roll my own. 

## Requirements
To start things off, as always with good architecture design, I'd like to discuss some of the requirements I have for such a framework. This way, we have a clear way to evaluate wether a certain framework is effective for what we want it to be. I have the following requirements: 

- A/B testing must be resolved at runtime. If we had to redeploy our app everytime we wished to change around some test, it would become quite cumbersome, especially as non-engineers may want to be involved in the process of A/B testing. 
- A/B testing must be configurable using some GUI. Again, researchers not involved in the codebase may want to A/B test, so they should have some environment to configure the A/B testing from. 
- Minimal changes to code. The codebase as it is should be able to be decorated with this A/B testing framework without much structural changes to be required. Otherwise, it would be too complicated to implement new tests. 
- Metrics on the A/B tests should be recorded and stored for research purposes. This must either be done by the framework itself, or without much change in the codebase, so as to make data analysis as automatic as possible for non-engineers. 
- Easy to self host or at least lacking vendor lock-in. We wish to keep things as open-source or cheap as possible. 

With these requirements in mind, let us look at some of the more popular choices (some of them fitting my specific use-case of a typescript react frontend with a C# backend). 

## Microsoft Feature Management
This first framework is a library built on top of ASP.NET, designed to handle feature flagging within existing ASP.NET projects. Besides feature flagging, it provides Targeting Filters where percentages can be defined to easily make A/B tests. It integrates natively with Azure App Configuration, but from priliminary research, also seems to heavily rely on Microsoft Azure to exploit its full functionality. 

Although this library is relatively leightweight and thus requires only minimal changes to the code, it does depend on Microsoft Azure for most of its functionality. Besides this, it also does not have any built in metrics or GUI, meaning that this has to be built on top of the A/B testing framework itself.

Because of this, my opinion would be to use this only if your organisation or project is heavily integrated into Microsoft software, and you value high compatibility with ASP.NET and Azure. For what I am working on, it feels like a framework I roll myself would give me more flexibility, while not requiring much more work compared to the MFM library. 

## Posthog
Next, I'd like to quickly discuss Posthog. This is a widely-used solution for product analytics that has experimentation in mind. The model is mostly focused on frontend A/B testing, integrating quite easily with React. Integration with dotnet is also possible quite easily by defining some service that handles the feature flags defined in its extensive GUI. The fact that Posthog is very extensive can be a blessing and a curse. It means that it has a lot of users and capabilities, but it can also mean that the solution is a bit overkill when you only need A/B testing. Nonetheless, it can be used for only those purposes, and gives plenty of ways to extend upon it in the future if necessary. 

Looking at Posthog, it checks all our boxes. Flags update instantly from the PostHog UI, as the flags are connected to some PostHog API endpoint. For the frontend, not much change is needed. An example of simple A/B testing could be:

```TypeScript
import posthog from 'posthog-js'
import { useFeatureFlagVariantKey } from 'posthog-js/react'

export const CheckoutButton = ({ userId }: { userId: string }) => {
    const variant = useFeatureFlagVariantKey('checkout-button-color')

    posthog.identify(userId)

    if (variant === undefined) {
        return <button className="btn btn-default">Checkout</button>
    }

    const handleClick = () => {
        posthog.capture('checkout_clicked')
    } // Save the fact that a user checks out, and with which variant. 

    return (
        <button
            onClick={handleClick}
            className={variant === 'test' ? 'btn btn-green' : 'btn btn-blue'} // Change color of button based on A/B test. 
        >
            Checkout
        </button>
    )
}
```

For the backend, we'd also be able to simply place conditionals in much the same way. The only addition really needed to make this robust is to have some KeyResolver that integrates this conditional, in order to make it link to architecture as defined in [this article](https://paulstapel.com/algorithm-testing-framework/). 

Posthog itself has a GUI to configure everything, and metrics are easily tracked and displayed there as well. Finally, it is possible to self-host posthog entirely on your own server. If that is not an option, the paid version is also affordable, though it can get expensive depending on the amount of users. 

## GrowthBook
Where Posthog is very broad, GrowthBook is tailored to A/B testing and analytics. It is completely open-source and can similarly be self-hosted. The main driving points of this solution are its robust statistics engine, integratability with postgres and specialty when it comes to A/B testing. 

Using growthbook in the frontend would look something like

```Typescript
import { useFeatureValue } from '@growthbook/growthbook-react'

export const CheckoutButton = ({ userId }: { userId: string }) => {
    const gb = useGrowthBook()
    gb?.setAttributes({ id: userId })

    const buttonColor = useFeatureValue('button-color', 'blue')

    return <button className={`btn btn-${buttonColor}`}>Checkout</button>
}
```

Whereas the usage in the backend would be very similar to that of PostHog in that we would have to make a wrapper around its usage. Furthermore, Growthbook also has a nice GUI where feature flags and A/B tests can be created. 

## Rolling our own solution
Finally, our own solution could be made to enable A/B testing. This would involve the following: 

- Creating some library in the frontend to make conditional inclusion of visuals easy to configure using the A/B testing framework.
- Doing the same for the backend.
- Storing information about the A/B tests into our database.
- Creating a separate GUI where A/B tests can be configured.
- Parsing the information from the GUI into the library and linking them together to allow for runtime changes in the A/B tests. 

All in all, this is quite possible, but also rather involved. Especially for projects that are on a time-budget, PostHog or GrowthBook would be better. However, it should be noted this internal solution is free to use (but takes time to build) and very flexible for changes in requirements for the A/B testing. 

## Conclusion
To conclude, I'd like to recommend the following: 

- PostHog if you wish to use software that is most widely used and heavily maintained. Also a good option if you may want to use more of their products in the future or like to have the cleanest GUI (and solution in general) without minding the extra spending. 
- GrowthBook if you like the solution to be free and open-source, with extra attention the the analytics possible with this solution. As the data will just be stored in your database, this is also the most flexible solution if you wish to employ more internal data analytics directly from your database. 
- Your own solution if you don't mind investing some time into creating this and want complete freedom and flexibilty in your software. 
- Microsoft Feature Management if you like disapointment.  

## That's all for today, pasta out. 

