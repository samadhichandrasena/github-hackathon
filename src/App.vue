<template>
  <v-app>
    <!-- Header/App Bar with gradient -->
    <v-app-bar elevation="2" height="120">
      <v-container class="pa-0">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" class="text-center">
            <v-fade-transition>
              <div class="d-flex flex-column align-center">
                <span class="text-h4 font-weight-bold mb-1">Medical X-ray Analysis</span>
                <span class="text-subtitle-1">Advanced AI-powered chest X-ray interpretation system</span>
              </div>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
      <template v-slot:image>
        <v-img
          gradient="to right, rgba(25, 118, 210, 0.95), rgba(13, 71, 161, 0.95)"
          height="100%"
        ></v-img>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8">
        <!-- Medical Alert -->
        <v-scale-transition>
          <v-alert
            color="blue-lighten-5"
            border="start"
            border-color="blue"
            class="mb-6"
          >
            <template v-slot:prepend>
              <v-icon
                color="blue"
                icon="mdi-alert-circle"
                size="24"
              ></v-icon>
            </template>
            <div class="text-blue-darken-2">
              This tool is designed to assist medical professionals and should not be used as a replacement for professional medical diagnosis.
            </div>
          </v-alert>
        </v-scale-transition>

        <!-- Feature Cards -->
        <v-row class="mb-6">
          <v-col
            v-for="(feature, index) in features"
            :key="index"
            cols="12"
            md="4"
          >
            <v-fade-transition>
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 8 : 1"
                  height="100%"
                  class="transition-ease-in-out"
                >
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon
                        :icon="feature.icon"
                        color="primary"
                        size="32"
                        class="mb-4"
                        v-bind="props"
                        :class="{ 'gentle-rotate': isHovering }"
                      ></v-icon>
                    </template>
                    <v-card-title>{{ feature.title }}</v-card-title>
                    <v-card-text>{{ feature.description }}</v-card-text>
                  </v-card-item>
                </v-card>
              </v-hover>
            </v-fade-transition>
          </v-col>
        </v-row>

        <v-row>
          <!-- Upload Section -->
          <v-col cols="12" md="6">
            <v-slide-x-transition>
              <v-card height="100%">
                <v-card-item>
                  <template v-slot:prepend>
                    <v-icon
                      icon="mdi-cloud-upload"
                      color="primary"
                      size="32"
                    ></v-icon>
                  </template>
                  <v-card-title>Upload X-ray Image</v-card-title>
                </v-card-item>

                <v-card-text>
                  <v-expand-transition>
                    <v-file-input
                      v-model="selectedFile"
                      accept="image/*"
                      :rules="uploadRules"
                      prepend-icon=""
                      label="Select X-ray Image"
                      :loading="isLoading"
                      @change="onFileChange"
                      :error-messages="errorMessage"
                      show-size
                      class="mb-4"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          color="primary"
                          icon="mdi-image"
                        ></v-icon>
                      </template>
                      
                      <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                          <v-chip
                            color="primary"
                            label
                            size="small"
                            class="me-2"
                          >
                            {{ fileName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-file-input>
                  </v-expand-transition>

                  <v-scale-transition>
                    <v-btn
                      block
                      color="primary"
                      size="large"
                      :disabled="!selectedFile || isLoading"
                      :loading="isLoading"
                      @click="submitImage"
                      class="mt-4"
                      elevation="2"
                      :class="{ 'gentle-highlight': selectedFile && !isLoading }"
                    >
                      <v-icon start icon="mdi-magnify"></v-icon>
                      {{ isLoading ? 'Analyzing...' : 'Analyze Image' }}
                    </v-btn>
                  </v-scale-transition>
                </v-card-text>
              </v-card>
            </v-slide-x-transition>
          </v-col>

          <!-- Results Section -->
          <v-col cols="12" md="6">
            <v-slide-x-transition>
              <v-card height="100%">
                <v-card-item>
                  <template v-slot:prepend>
                    <v-icon
                      icon="mdi-file-document"
                      color="primary"
                      size="32"
                    ></v-icon>
                  </template>
                  <v-card-title>Analysis Results</v-card-title>
                </v-card-item>

                <v-card-text>
                  <!-- Image Preview -->
                  <v-fade-transition>
                    <div v-if="imageUrl" class="mb-4">
                      <v-img
                        :src="imageUrl"
                        :aspect-ratio="16/9"
                        cover
                        class="bg-grey-darken-4 rounded"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="grey-lighten-5"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </div>
                  </v-fade-transition>

                  <!-- Prediction Results -->
                  <v-expand-transition>
                    <div v-if="prediction" class="mt-4">
                      <h3 class="text-h6 mb-4">Detected Conditions</h3>
                      <v-list>
                        <v-slide-y-transition group>
                          <v-list-item
                            v-for="(prob, index) in prediction"
                            :key="index"
                            :subtitle="`Confidence: ${(prob.probability * 100).toFixed(1)}%`"
                            class="mb-2"
                          >
                            <template v-slot:prepend>
                              <v-icon
                                :color="getConfidenceColor(prob.probability)"
                                icon="mdi-check-circle"
                                class="subtle-fade-in"
                              ></v-icon>
                            </template>
                            <v-list-item-title>
                              {{ prob.condition }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-slide-y-transition>
                      </v-list>
                    </div>
                  </v-expand-transition>

                  <!-- No Results State -->
                  <v-fade-transition>
                    <div
                      v-if="!imageUrl && !prediction"
                      class="text-center py-12"
                    >
                      <v-icon
                        icon="mdi-image-outline"
                        size="64"
                        color="grey-lighten-1"
                        class="mb-4"
                      ></v-icon>
                      <div class="text-medium-emphasis">Upload an X-ray image to see the analysis results</div>
                    </div>
                  </v-fade-transition>
                </v-card-text>
              </v-card>
            </v-slide-x-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4">
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <span class="text-caption">
            © {{ new Date().getFullYear() }} Medical X-ray Analysis System. For professional use only.
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'XrayAnalysis',
  
  data() {
    return {
      selectedFile: null,
      imageUrl: null,
      prediction: null,
      isLoading: false,
      errorMessage: null,
      features: [
        {
          icon: 'mdi-heart-pulse',
          title: 'Advanced AI Analysis',
          description: 'State-of-the-art deep learning models for accurate disease detection'
        },
        {
          icon: 'mdi-file-certificate',
          title: 'Detailed Reports',
          description: 'Comprehensive analysis with probability scores for multiple conditions'
        },
        {
          icon: 'mdi-shield-check',
          title: 'Clinical Precision',
          description: 'Developed and validated with leading healthcare institutions'
        }
      ],
      uploadRules: [
        value => !value || value.size < 10000000 || 'Image size should be less than 10 MB!',
        value => !value || value.type.startsWith('image/') || 'Please upload an image file!'
      ]
    }
  },

  methods: {
    onFileChange(file) {
      if (file) {
        this.errorMessage = null;
        this.prediction = null;
        
        if (!file.type.startsWith('image/')) {
          this.errorMessage = 'Please upload a valid image file';
          this.selectedFile = null;
          return;
        }

        this.imageUrl = URL.createObjectURL(file);
      } else {
        this.imageUrl = null;
        this.prediction = null;
      }
    },

    async submitImage() {
      if (!this.selectedFile) return;

      this.isLoading = true;
      this.errorMessage = null;
      
      // Simulated API call
      setTimeout(() => {
        this.prediction = [
          { condition: "Pneumonia", probability: 0.82 },
          { condition: "Cardiomegaly", probability: 0.15 },
          { condition: "Pleural Effusion", probability: 0.03 }
        ];
        this.isLoading = false;
      }, 2000);
    },

    getConfidenceColor(probability) {
      if (probability >= 0.7) return 'success';
      if (probability >= 0.4) return 'warning';
      return 'error';
    }
  },

  beforeUnmount() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
};
</script>

<style>
.v-app-bar {
  color: white !important;
}

/* Animation classes - more subtle versions */
.transition-ease-in-out {
  transition: all 0.3s ease-in-out !important;
}

.gentle-rotate {
  transform: rotate(180deg);
  transition: transform 1s ease-in-out;
}

.gentle-highlight {
  animation: gentleHighlight 3s infinite;
}

.subtle-fade-in {
  animation: fadeIn 0.8s ease-in;
}

@keyframes gentleHighlight {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
