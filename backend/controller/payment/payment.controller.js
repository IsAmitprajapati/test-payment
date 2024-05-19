const stripe = require("../../config/stripe")


const paymentController = async(request,response)=>{

    const { cartItems } = request.body
    try {

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            billing_address_collection : 'auto',
            shipping_options : [
                {
                    shipping_rate : 'shr_1N0qDnSAq8kJSdzMvlVkJdua'
                }
            ],

            customer_creation : 'if_required',
            customer_email : "test@gmail.com",
            metadata : {
                customerId : cartItems.userId,
                productId : JSON.stringify(cartItems.map(el => el?.productId?._id))
            },
            line_items : cartItems.map(items => {
                return{
                    price_data : {
                        currency : 'inr',
                        product_data : {
                            name : items.productId.productName,
                            images : items.productId.productImage,
                        },
                        unit_amount : items.productId.sellingPrice,
                    },
                    adjustable_quantity : {
                        enabled : true,
                        minimum : 1
                    },
                    quantity : items.quantity,
                }
            }),
            success_url : "http://localhost:3000/sucess",
            cancel_url : "http://localhost:3000/cancel"
        }
        const session = await stripe.checkout.sessions.create(params)
        return response.status(200).json({
            data : session,
            message : 'Redirect to Payment gateway'
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message
        }) 
    }
}

module.exports = paymentController