<script setup>
          import { onMounted, watch } from 'vue';
	  import { initialPrompt, influencer_name } from '../api/prompts.js';

	  const messages = ref([
	    {
	      role: '丶时光啊AI',
	      message: '你好！我是丶时光啊的AI摇光人格。逻辑魔兽，科学魔兽！提供各种私教咨询和魔兽游戏咨询，冒险者今天有什么想问我的吗？'
	    }
	  ]);
	  const loading = ref(false);
	  const message = ref('');
	  let isTyping = ref(false);
	  let isAnimating = ref(false);
	  const typing = ref(false); // New ref
	  
	  const saveChatHistory = () => {
		  try {
		    // Check if storage is full
		    if (isStorageFull()) {
		      // Remove the oldest message
		      messages.value.shift();
		    }
		
		    window.localStorage.setItem('chatHistory', JSON.stringify(messages.value));
		  } catch (e) {
		    console.error('Failed to save chat history:', e);
		  }
		};
	
	  const loadChatHistory = async () => {
		  try {
		    const chatHistory = window.localStorage.getItem('chatHistory');
		    if (chatHistory) {
		      messages.value = JSON.parse(chatHistory);
		
		      // If the user is not currently typing a message and the assistant is not currently generating a message
		      if (!isTyping.value && !isAnimating.value) {
		        // Check if a proactive message should be sent
		        const proactiveMessage = await shouldSendProactiveMessage(messages.value);
		        if (proactiveMessage) {
		          // If a proactive message should be sent, add it to the messages
		          messages.value.push({
		            role: '丶时光啊AI',
		            message: proactiveMessage
		          });
		          scrollToEnd();
		        }
		      }
		    }
		  } catch (e) {
		    console.error('Failed to load chat history:', e);
		  }
		};

	
	const isStorageFull = () => {
	  try {
	    const testKey = 'test';
	    window.localStorage.setItem(testKey, 'test');
	    window.localStorage.removeItem(testKey);
	    return false;
	  } catch (e) {
	    return true;
	  }
	};
	
	const restartConversation = () => {
	  // Clear the messages array
	  messages.value = [
	    {
	      role: '丶时光啊AI',
	      message: '你好！我是丶时光啊的AI摇光人格。逻辑魔兽，科学魔兽！提供各种私教咨询和魔兽游戏咨询，冒险者今天有什么想问我的吗？'
	    }
	  ];
	
	  // Clear the chat history from local storage
	  localStorage.removeItem('chatHistory');
	};

	const checkForProactiveMessage = async () => {
		  // If the user is not currently typing a message
		  if (!isTyping.value) {
		    // Check if a proactive message should be sent
		    const proactiveMessage = await shouldSendProactiveMessage(messages.value);
		    if (proactiveMessage) {
		      // Send the proactive message
		      messages.value.push({
		        role: '丶时光啊AI',
		        message: proactiveMessage
		      });
		      scrollToEnd();
		    }
		  }
		};

	  // Function for the text generation animation
	  const typeMessage = (messageText) => {
	    let i = 0;
	    isTyping.value = true;
	    isAnimating.value = true;
	    function typing() {
	      if (i < messageText.length) {
		messages.value[messages.value.length - 1].message += messageText.charAt(i);
		i++;
		setTimeout(typing, 60); // Adjust the typing speed here
	      } else {
		isTyping.value = false;
		isAnimating.value = false;
		saveChatHistory();
	      }
	    }
	    typing();
	  };
	  const scrollToEnd = () => {
	    setTimeout(() => {
	      const chatMessages = document.querySelector('.chat-messages > div:last-child');
	      chatMessages?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	    }, 100);
	  };

	 const shouldSendProactiveMessage = async (messages) => {
		  // Prepare the prompt for the model
		  const userPrompt = messages.map((message) => `${message.role}: ${message.message}`).join('\n') + `\n丶时光啊AI:`;
		
		  // Make the API call
		  const req = await fetch('https://api.openai.com/v1/chat/completions', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		      Authorization: `Bearer ${config.OPENAI_API_KEY}`
		    },
		    body: JSON.stringify({
		      model: 'gpt-3.5-turbo-16k',
		      messages: [
		        { role: 'user', content: `${initialPrompt} Act as ${influencer_name} were to analyze the conversation and decide whether to send a proactive message. If no, just say "不" and If yes, what should the message be? Please reply your proactive message in the first-person view and make it impressive. Output your words in Chinese.` },
		        ...messages.map((message) => ({
		          role: message.role === '丶时光啊AI' ? 'assistant' : 'user',
		          content: message.message
		        }))
		      ]
		    })
		  });
		
		  // Parse the response
		  const res = await req.json();
		  const result = res.choices[0].message;
		
		  // If the model decided to send a proactive message, return the message. Otherwise, return null.
		  // If the model decided not to send a proactive message, return null. Otherwise, return the message.
		  return result.content.includes('不,') ? null : result.content.trim();


		};

	  const sendPrompt = async () => {
	    if (message.value === '') return;
	    loading.value = true;
	    typing.value = true; // Set typing to true when user submits a message
	    messages.value.push({
	      role: 'User',
	      message: message.value
	    });
	    scrollToEnd();
	    message.value = '';
	    const res = await fetch(`/api/chat`, {
	      body: JSON.stringify(messages.value.slice(1)),
	      method: 'post'
	    });
	    if (res.status === 200) {
		    const response = await res.json();
		    typing.value = false; // Set typing to false when the response is received
		    messages.value.push({
		      role: '丶时光啊AI',
		      message: '' // Start with an empty message
		    });
		    typeMessage(response?.message); // Animate the message being typed
		  } else {
		    messages.value.push({
		      role: '丶时光啊AI',
		      message: '您的回复太快了请休息一下稍后再试.'
		    });
		  }
		  loading.value = false;
		  scrollToEnd();
	  };
	  watch(messages, checkForProactiveMessage);
	  onMounted(loadChatHistory);
</script>


<template>
	<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
	<!-- Other head elements -->
  	</head>

	<div class="max-w-xl mx-auto text-black">
		<a
			href="http://lightcube.me/"
			class="flex justify-center px-10 py-2 mx-auto space-x-1 text-sm font-medium text-center text-gray-600 transition-all rounded-full shadow-sm group bg-white/30 ring-1 ring-gray-900/5 hover:shadow-lg active:shadow-sm"
		>
			创建属于你的AI摇光
		</a>
		<h1 class="my-8 text-5xl font-bold text-center text-black">丶时光啊AI</h1>
		<img src="https://raw.githubusercontent.com/Johnnnmai/unknown/fce3cf19a75fb421733cd3d966334579f0b108b3/image.png" alt="Profile Picture" class="profile-picture" />

		<div class="max-w-xl mx-auto">
			<div class="bg-white rounded-md shadow h-[60vh] flex flex-col justify-between">
				<div class="h-full overflow-auto chat-messages">
					<div v-for="(message, i) in messages" :key="i" class="flex flex-col p-4">
						<div v-if="message.role === '丶时光啊AI'" class="pr-8 mr-auto">
							<div class="p-2 mt-1 text-sm text-gray-700 bg-gray-200 rounded-lg text-smp-2">
								{{ message.message }}
							</div>
						</div>
						<div v-else class="pl-8 ml-auto">
							<div class="p-2 mt-1 text-sm text-white bg-blue-400 rounded-lg">
								{{ message.message }}
							</div>
						</div>
					</div>
					<div class="p-4 ml-10 mr-auto" v-if="loading">
						<span class="loader"></span>
					</div>
					<div class="p-4 ml-10 mr-auto" v-if="typing">
						丶时光啊AI is typing...
					</div>
				</div>
				<form @submit.prevent="sendPrompt">
					<div class="flex items-center w-full p-4">
						<input
							v-model="message"
							type="text"
							placeholder="Type here..."
							class="w-full p-1 text-sm text-black bg-transparent bg-gray-100 border rounded-md shadow border-white/40 grow"
							:disabled="loading || typing || isAnimating"
						/>
						<button
							:disabled="loading || typing || isAnimating"
							type="submit"
							class="flex items-center justify-center flex-none w-10 h-10 ml-2 bg-green-500 rounded-full"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22 2L11 13"
									stroke="white"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M22 2L15 22L11 13L2 9L22 2Z"
									stroke="white"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>

			<button @click="restartConversation" class="restart-button">
			  Restart Conversation
			</button>

			<div class="flex items-center justify-center my-2">
				<span>摇光人格</span>
				<a
					href="http://lightcube.me/"
					class="flex items-center mx-1 font-medium underline transition-colors underline-offset-4 hover:text-black/70"
				>
					<p>LightCube.Me</p>
				</a>
				
			</div>
		
	</div>
	
</template>

<style>
	.loader {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: block;
		position: relative;
		color: #d3d3d3;
		box-sizing: border-box;
		animation: animloader 2s linear infinite;
	}

	@keyframes animloader {
		0% {
			box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px;
		}
		25% {
			box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 2px;
		}
		50% {
			box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 2px, -38px 0 0 -2px;
		}
		75% {
			box-shadow: 14px 0 0 2px, 38px 0 0 -2px;
		}
	}
	
	.profile-picture {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	  /* Add more styles as needed */
	}
	
	input[type="text"], input[type="search"], textarea {
	  -webkit-text-size-adjust: 100%;
	  -webkit-appearance: none;
	  -moz-appearance: none;
	  appearance: none;
	  text-transform: none;
	  text-autocapitalize: none;
	  text-autocorrect: off;
	}
	.restart-button {
	  padding: 10px 20px;
	  background-color: #f44336; /* Red */
	  color: white;
	  border: none;
	  cursor: pointer;
	  font-size: 16px;
	  margin-top: 20px;
	}
	
	/* Darker background on mouse-over */
	.restart-button:hover {
	  background-color: #da190b;
	}



</style>
