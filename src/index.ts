
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as sgMail from '@sendgrid/mail';
admin.initializeApp(functions.config().firebase);

const accountSid = functions.config().twilio.sid;
const dfdapprovednumber = functions.config().twilio.dfdapprovednumber;
const token = functions.config().twilio.token;
// const sendGridApiKey = functions.config().twilio.sendgridapikey;
const client = require('twilio')(accountSid, token);
const cors = require('cors')({origin: true});


exports.whatsappNewSignUp = functions
        .firestore.document(`users/{userId}`)
        .onCreate( (snap, context) => {

            const userWhatsappMessage = {
              body:`Congratulations ${snap.data().displayName} from ${snap.data().market}, your Direct From Dubai account has successfully been created. One of our team will get in touch with you soon.`,
              to:`whatsapp:${snap.data().phone}`,
              from:`whatsapp:${dfdapprovednumber}`
            }

            return client.messages.create(userWhatsappMessage).then( message => console.log(message)).catch( error => console.log(error))

            
            // send email
            // sgMail.setApiKey(sendGridApiKey);
            //   const message = {
            //     to: `${snap.data().email}`,
            //     from: 'elkanarop@gmail.com',
            //     subject: 'Welcome Onboard',
            //     text: `Congratulations ${snap.data().displayName} from ${snap.data().market}, your Direct From Dubai account has successfully been created. One of our team will get in touch with you soon.`,
            //     // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            //   };
            //   return sgMail.send(message)
            //   .then( msg => console.log(msg))
            //   .catch( error => console.log(error))

        });
        
exports.whatsappNewMessage = functions
        .firestore.document(`directMessages/{messageId}`)
        .onCreate((snap, context) => {

          if(snap.data().tag ==='admin'){

            return admin.database().app.firestore().collection('users').doc(snap.data().subject).get()
            .then( res =>{

              const user = res.data();
              const textMessage = {
                      body:`${snap.data().body}`,
                      to: `whatsapp:${user.phone}`,
                      from: `whatsapp:${dfdapprovednumber}`
                    }
        
              return client.messages.create(textMessage)
                    .then( message => console.log(message))
                    .catch( error => console.log(error))

            })
            .catch( error=> error ) 
          } else {
            
            return admin.database().app.firestore().collection('users').doc(snap.data().subject).get()
            .then( res =>{

              const user = res.data();
              const textMessage = {
                      body:`${snap.data().body}`,
                      to: `whatsap:${user.phone}`,
                      from: `whatsapp:${dfdapprovednumber}`
                    }
        
              return client.messages.create(textMessage)
                    .then( message => console.log(message))
                    .catch( error => console.log(error))

            })
            .catch( error=> error ) 

          }
});

exports.whatsappDubaiCustomerOnInquiry = functions
        .firestore.document(`dubaiEngagments/{questionId}`)
        .onCreate((snap, context) => {

          if(snap.data().receiverId){

            return admin.database().app.firestore().collection('users').doc(snap.data().receiverId).get()
            .then( res =>{

              const user = res.data();
              const textMessage = {
                      body:`${snap.data().body}`,
                      to: `whatsapp:${user.phone}`,
                      from: `whatsapp:${dfdapprovednumber}`
                    }
        
              return client.messages.create(textMessage)
                    .then( message => console.log(message))
                    .catch( error => console.log(error))

            })
            .catch( error=> error ) 
          }return null
});

 exports.whatsappNewVehicle = functions
        .firestore.document(`vehicles/{vehicleId}`)
        .onCreate((snap, context) => {


        return admin.database().app.firestore().collection('users').doc(snap.data().userId).get()
        .then( res =>{

          const user = res.data();
          const textMessage = {
                  body:`Congratulations ${user.displayName} from ${user.market}. Your vehicle details: ${snap.data().modelYear} ${snap.data().make} ${snap.data().model} ${snap.data().engineModel}  ${snap.data().engineSize}L has been received. One of our team will get in touch soon on the next steps.`,
                  to: `whatsapp:${user.phone}`,
                  from: `whatsapp:${dfdapprovednumber}`
                }
    
          return client.messages.create(textMessage)
                .then( message => console.log(message))
                .catch( error => console.log(error))

        })
        .catch( error=> error )
});

exports.whatsappAdminOnNewOffer = functions
.firestore.document(`offers/{offerId}`)
.onCreate((snap, context) => {


return admin.database().app.firestore().collection('vehicles').doc(snap.data().carId).get()
.then( car =>{

  const vehicle = car.data();

  return admin.database().app.firestore().collection('europe').doc(snap.data().userId).get()
  .then( europCustomer => {

    const dealer = europCustomer.data();

    const textMessage = {
      body:`Hello Admin, ${dealer.owner} from ${dealer.dealership} placed an offer of €${snap.data().myOfferPrice} on ${vehicle.modelYear+' '+vehicle.make+' '+vehicle.model+' '+vehicle.engineModel}. Get in touch on phone: ${dealer.phone} or email: ${dealer.email}.`,
      to: 'whatsapp:+254703283383',
      from: `whatsapp:${dfdapprovednumber}`
    }

    return client.messages.create(textMessage)
        .then( message => console.log(message))
        .catch( error => console.log(error))


  })
  .catch(error=> console.log(error))
})
.catch( error=> console.log(error))
});

exports.whatsappAdminOnNewRequest = functions
.firestore.document(`requests/{requestId}`)
.onCreate((snap, context) => {
  const vehicle = snap.data()

return admin.database().app.firestore().collection('europe').doc(snap.data().dealer).get()
.then( res =>{

    const dealer = res.data();

    const textMessage = {
      body:`Hello Admin, ${dealer.owner} from ${dealer.dealership || dealer.marketSegment} placed a request of ${vehicle.year+' '+vehicle.make+' '+vehicle.model+' '+vehicle.bodyType}. Maximum Budget is €${vehicle.maxBudget}. Get in touch on phone: ${dealer.phone} or email: ${dealer.email}.`,
      to: 'whatsapp:+254703283383',
      from: `whatsapp:${dfdapprovednumber}`
    }

    return client.messages.create(textMessage)
        .then( message => console.log(message))
        .catch( error => console.log(error))

  })
.catch( error => console.log(error))
});

exports.whatsappOwnerOnNewOffer = functions
.firestore.document(`dubaiOffers/{offerId}`)
.onCreate((snap, context) => {


return admin.database().app.firestore().collection('vehicles').doc(snap.data().carId).get()
.then( car =>{

  const vehicle = car.data();

  return admin.database().app.firestore().collection('dubai').doc(snap.data().sellerId).get()
  .then( europCustomer => {

    const dealer = europCustomer.data();

    const textMessage = {
      body:`Congratulations ${dealer.name || dealer.owner} from ${dealer.dealership || dealer.address}. A new offer of AED${snap.data().adminOfferPrice} has been placed on your vehicle: ${vehicle.modelYear+' '+vehicle.make+' '+vehicle.model+' '+vehicle.engineModel}. Kindly get back to us if you are interested.`,
      to: `whatsapp:${dealer.phone}`,
      from: `whatsapp:${dfdapprovednumber}`
    }

    return client.messages.create(textMessage)
        .then( message => console.log(message))
        .catch( error => console.log(error))


  })
  .catch(error=> console.log(error))
})
.catch( error=> console.log(error))
});


exports.whatsappOwnerOnNewOrder = functions
.firestore.document(`dubaiOrders/{orderId}`)
.onCreate((snap, context) => {
return admin.database().app.firestore().collection('vehicles').doc(snap.data().vehicleId).get()
.then( car =>{

  const vehicle = car.data();

  return admin.database().app.firestore().collection('dubai').doc(snap.data().sellerId).get()
  .then( europCustomer => {

    const dealer = europCustomer.data();

    const textMessage = {
      body:`Congratulations ${dealer.name || dealer.owner}! An order has been placed on your  ${vehicle.modelYear+' '+vehicle.make+' '+vehicle.model+' '+vehicle.engineModel} at AED${snap.data().adminOrderPrice} on ${snap.data().ordeDate}.`,
      to: `whatsapp:${dealer.phone}`,
      from: `whatsapp:${dfdapprovednumber}`
    }

    return client.messages.create(textMessage)
        .then( message => console.log(message))
        .catch( error => console.log(error))


  })
  .catch(error=> console.log(error))
})
.catch( error=> console.log(error))
});

exports.whatsappOwnerOnVehicleApproved = functions
.firestore.document(`vehicles/{vehicleId}/{qualificationToken}`)
.onUpdate((change, context) => {

  const update = change.after.data();

    return admin.database().app.firestore().collection('dubai').doc(update.userId).get()
    .then( res =>{

      const customer = res.data();

       if(update.qualificationToken.approved===true){

          const textMessage = {

            body:`Congratulations ${customer.name || customer.owner}, your vehicle: ${update.modelYear+' '+update.make+' '+update.model+' '+update.engineModel} has been approved.`,
            to: `whatsapp:${customer.phone}`,
            from: `whatsapp:${dfdapprovednumber}`
          }

          return client.messages.create(textMessage)
          .then( message => console.log(message))
          .catch( error => console.log(error))

       } else if(update.qualificationToken.approved===false) {
         console.log('Not Approved Yet')
        }



    })
    .catch( error=> console.log(error))

});


exports.whatsappBuyerOnNewOrder = functions
.firestore.document(`orders/{orderId}`)
.onCreate((snap, context) => {


return admin.database().app.firestore().collection('vehicles').doc(snap.data().vehicleId).get()
.then( car =>{

  const vehicle = car.data();

  return admin.database().app.firestore().collection('europe').doc(snap.data().userId).get()
  .then( europeCustomer => {

    const dealer = europeCustomer.data();

    const textMessage = {
      body:`Congratulation  ${dealer.name || dealer.owner} from ${dealer.dealership || dealer.address}! Your order for ${vehicle.modelYear+' '+vehicle.make+' '+vehicle.model+' '+vehicle.engineModel} has been placed successfully. One of our team will get back to you soon on the next steps.`,
      to: `whatsapp:${dealer.phone}`,
      from: `whatsapp:${dfdapprovednumber}`
    }

    return client.messages.create(textMessage)
        .then( message => console.log(message))
        .catch( error => console.log(error))


  })
  .catch(error=> console.log(error))
})
.catch( error=> console.log(error))
});

exports.incomingMessageFromTwilio = functions.https.onRequest((request, response) => {

  cors( request, response, () => {

    const content = request.body
    const phone = content.From.substring(9,22)

    return admin.database().app.firestore().collection('users').where('phone','==',phone).get()
    .then( res => {
      
      res.forEach( each => {


          const message =  {

            sender:each.id,
            read:false,
            subject:each.id,
            tag:each.get('market'),
            name:each.get('displayName'),
            from:content.From.substring(9,22),
            to:content.To.substring(9,22),
            status:content.SmsStatus,
            body:content.Body,
            class:'chat chat-left',
            align:'left',
            createdAt: new Date().toUTCString(), 
      
          }

            if(!each.get('token')){

              admin.database().app.firestore().collection('directMessages').add(message)
              .then(doc => response.send(doc))
              .catch( error =>  response.send(error))
            }else if(each.get('token')){

              const chatToken = each.get('token').activity;

                if(chatToken==='offer'){
                  return admin.database().app.firestore().collection('dubaiEngagments').add({
                  body: content.Body,
                  createdAt:new Date().toUTCString(),
                  senderEmail:each.get('email'),
                  senderId:each.id,
                  senderName:each.get('displayName'),
                  senderPhone:each.get('phone'),
                  subject:each.get('token').activity,
                  subjectId:each.get('token').activityReff,
                  tag:"customer",
                  vehicleId:each.get('token').vehicle
                })
                .then(off => response.send(off))
                .catch( er=>  response.send(er))
                }else if(chatToken==='order'){
                  return admin.database().app.firestore().collection('dubaiEngagments').add({
                  body: content.Body,
                  createdAt:new Date().toUTCString(),
                  senderEmail:each.get('email'),
                  senderId:each.id,
                  senderName:each.get('displayName'),
                  senderPhone:each.get('phone'),
                  subject:each.get('token').activity,
                  subjectId:each.get('token').activityReff,
                  tag:"customer",
                  vehicleId:each.get('token').vehicle
              })
              .then(off => response.send(off))
              .catch( er=>  response.send(er))
                }else if(chatToken==='inquiry'){
                  return admin.database().app.firestore().collection('dubaiEngagments').add({
                  body: content.Body,
                  createdAt:new Date().toUTCString(),
                  senderEmail:each.get('email'),
                  senderId:each.id,
                  senderName:each.get('displayName'),
                  senderPhone:each.get('phone'),
                  subject:each.get('token').activity,
                  subjectId:each.get('token').activityReff,
                  tag:"customer",
                  read:false,
                  vehicleId:each.get('token').vehicle
              })
              .then(off => response.send(off))
              .catch( er=>  response.send(er))
                }else if(chatToken==='dm'){
                  return admin.database().app.firestore().collection('directMessages').add(message)
                    .then(off => response.send(off))
                    .catch( er=>  response.send(er))
                }return null

            } return null

      })
      
    })
    .catch(error =>  response.send(error))

  })
  

   
  // cors(request, response, () => {

  //   const content = request.body

  //     return admin.database().app.firestore().collection('directMessages').add(
  //       {
  //         from: content.From,
  //         to: content.To,
  //         status: content.SmsStatus,
  //         body: content.Body,
  //         // mediaUrl: data.MediaUrl,
  //         createdAt: Date()
  //       })
  //       .then(doc => console.log(doc)).catch( error => {
  //         return response.send(error)
  //       })
  // } );
});

exports.trackActiveChats = functions
        .firestore.document(`directMessages/{messageId}`)
        .onCreate((snap, context) => {

        return admin.database().app.firestore().collection('users').doc(snap.data().sender).get()
        .then( res =>{

          return admin.database().app.firestore().collection('directMessages')
          .where('sender','==',snap.data().sender)
          .where('read','==',false).get()
          .then( good => {

            

            const message =  {

              name: res.data().displayName,
              sender: res.id,
              read:false,
              tag:res.data().market,
              unreadCount:good.size,
              lastMessage: snap.data().body,
              createdAt: Date()
        
            }

            return admin.database().app.firestore().collection('activeChats').doc(res.id).set(message)
            .then( run => console.log(run))
            .catch( err =>  console.log(err))
          })
          .catch( weri => console.log(weri))

               

        })
        .catch( error=> error )  

});

exports.updateActiveChats = functions
        .firestore.document(`directMessages/{messageId}`)
        .onUpdate( change => {

          return admin.database().app.firestore().collection('users').doc(change.after.data().sender).get()
          .then( res =>{
  
            return admin.database().app.firestore().collection('directMessages')
            .where('sender','==',change.after.data().sender)
            .where('read','==',false).get()
            .then( good => {
  
              
  
              const message =  {
  
                name:res.data().displayName,
                sender: res.id,
                read:true,
                tag:res.data().market,
                unreadCount:good.size,
                lastMessage: change.after.data().body,
                createdAt: Date()
          
              }

              if(change.after.data().tag==='admin'){
                return null
              }return admin.database().app.firestore().collection('activeChats').doc(res.id).set(message)
              .then( run => console.log(run))
              .catch( err =>  console.log(err))
            })
            .catch( weri => console.log(weri))
  
                 
  
          })
          .catch( error=> error )  
  
  });

  exports.trackActiveInquiries = functions
        .firestore.document(`dubaiEngagments/{messageId}`)
        .onCreate((snap, context) => {

        return admin.database().app.firestore().collection('users').doc(snap.data().receiverId).get()
        .then( res =>{

          // return admin.database().app.firestore().collection('directMessages')
          // .where('sender','==',snap.data().sender)
          // .where('read','==',false).get()
          // .then( good => {

            

            const message =  {

              vehicleId: snap.data().vehicleId,
              body: snap.data().body,
              read:false,
              receiverId:res.id,
              subjectId: snap.data().subjectId,
              // unreadCount:good.size,
              // senderName: res.data().senderName,
              // senderId: res.id,
              tag:res.data().market,
              createdAt: new Date().toUTCString()
        
            }

            return admin.database().app.firestore().collection('activeInquiries').doc(snap.data().vehicleId).set(message)
            .then( run => console.log(run))
            .catch( err =>  console.log(err))
          // })
          .catch( weri => console.log(weri))

               

        })
        .catch( error=> error )  

});


exports.trackForwardeOffer = functions
  .firestore.document(`dubaiOffers/{offerId}`)
  .onCreate((snap, context) => {

  return admin.database().app.firestore().collection('users').doc(snap.data().sellerId).update(
    {
      token : {
      activity:'offer',
      vehicle:snap.data().carId,
      activityReff: snap.data().offerRefference
     }
   })
  .then( res => res)
  .catch( error=> error )  

});

exports.trackForwardeOrder = functions
  .firestore.document(`dubaiOrders/{orderId}`)
  .onCreate((snap, context) => {

  return admin.database().app.firestore().collection('users').doc(snap.data().sellerId).update(
    {
      token : {
      activity:'order',
      vehicle:snap.data().vehicleId,
      activityReff: snap.data().orderRefference
     }
   })
  .then( res => res)
  .catch( error=> error )  

});

exports.trackInquiries = functions
  .firestore.document(`dubaiQuestions/{quizId}`)
  .onCreate((snap, context) => {

  return admin.database().app.firestore().collection('users').doc(snap.data().receiverId).update(
    {
      token : {
      activity:'inquiry',
      vehicle:snap.data().vehicleId,
      activityReff: snap.data().subjectId
     }
   })
  .then( res => res)
  .catch( error=> error )  

});


exports.trackDirectMessages = functions
  .firestore.document(`directMessages/{messageId}`)
  .onCreate((snap, context) => {

    if(snap.data().tag==='admin'){
      return admin.database().app.firestore().collection('users').doc(snap.data().subject).update(
        {
          token : {
          activity:'dm',
         }
       })
      .then( res => res)
      .catch( error=> error )  
    } return null

});

  // exports.textUserStatusChange = functions.database
  //         .ref(`/users/{userId}/status`)
  //         .onWrite(event => {

  //           const userId = event.before.key

  //           return admin.database()
  //                       .ref(`/users/${userId}`)
  //                       .once('value')
  //                       .then( snapshot => snapshot.toJSON())
  //                       .then( user => {
  //                         user 
  //                       })
                       

  //                         const status = userObject.status
  //                         const phone = user.phone
  //                         const name = user.name
  //                         const address = user.address
  //                         const country = user.coutry

  //                         if( !validE164(phone)){
  //                           throw new Error(`${phone} must be E164 format!`);
  //                         }

  //                         const textMessage = {
  //                           body: `Hello ${name}, from ${address}, ${country} your account status changedto ${status}`,
  //                           // to: env.twilio2.twilio_verified_number,
  //                           to:'+254778635802',
  //                           from: env.twilio2.trial_number
  //                         }
    
  //                         return client.messages.create(textMessage);

  //                       })
             
  //           // const newValue = change.after.val()
  //           // const previousValue = change.after.val();
  //           // const userId = context.params.userId;

  //           return admin.database()
  //               .ref(`/users/${userId}`).once('value')
  //               .then( snapshot => {

  //                   const user = snapshot.val()
  //                   // const name = newValue.name
  //                   // const address = newValue.address;
  //                   // const country = newValue.country;
  //                   // const phone = newValue.phone;
               
  //                   const name = user.name;
  //                   const address = user.address;
  //                   const country = user.country;
  //                   const phone = user;

  //                   if( !validE164(phone)){
  //                       throw new Error(`${phone} must be E164 format! USER = ${user}& NAME: ${name} `);
  //                     }

  //                     const textMessage = {
  //                       body: `Hello ${name}, from ${address}, ${country} your account status changed from ${newValue} to ${previousValue}`,
  //                       // to: env.twilio2.twilio_verified_number,
  //                       to:'+254778635802',
  //                       from: env.twilio2.trial_number
  //                     }

  //                     return client.messages.create(textMessage);

  //               })
  //               .then(message => console.log(message))
  //               .catch( err => { console.log(err)})
            
  //        });
