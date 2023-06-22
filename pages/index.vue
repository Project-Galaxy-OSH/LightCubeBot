<script setup>
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
	  // Function for the text generation animation
	  const typeMessage = (messageText) => {
	    let i = 0;
	    isTyping.value = true;
	    isAnimating.value = true;
	    function typing() {
	      if (i < messageText.length) {
		messages.value[messages.value.length - 1].message += messageText.charAt(i);
		i++;
		setTimeout(typing, 100); // Adjust the typing speed here
	      } else {
		isTyping.value = false;
		isAnimating.value = false;
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


</style>
