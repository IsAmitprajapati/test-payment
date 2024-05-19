const stripe = require("../../config/stripe");

const stripe_endpoint_secret = process.env.STRIPE_ENDPOINT_SECRET

const stripeWebhook = async(request,response)=>{
    const signature = request.headers['stripe-signature'];
    const body = request.body

    let event ;

    console.log("stripe_endpoint_secret",stripe_endpoint_secret)
    console.log("signature",signature)

    try {
        event = await stripe.webhooks.constructEvent(body,signature,stripe_endpoint_secret)
    } catch (error) {
        console.log(error)
        response.status(400).send(`Webhook Error : ${error.message}`)
        return;
    }

    switch(event.type){
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        case 'subscription_schedule.canceled':
            const subscriptionScheduleCanceled = event.data.object;
                // Then define and call a function to handle the event subscription_schedule.canceled
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }


    response.status(200).send()

}


module.exports = stripeWebhook