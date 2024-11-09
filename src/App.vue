<template>
  <v-app>
    <!-- Header with White Text -->
    <v-app-bar elevation="2" height="140">
      <v-container class="pa-0">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" class="text-center">
            <v-fade-transition>
              <div class="d-flex flex-column align-center">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-radiobox-marked" size="36" class="me-2 text-white"></v-icon>
                  <span class="text-h3 font-weight-bold text-white">ChestVision AI</span>
                </div>
                <span class="text-subtitle-1 text-white">Advanced Al-powered chest X-ray interpretation system</span>
                <div class="mt-2 d-flex">
                </div>
              </div>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
      <template v-slot:image>
        <v-img
          gradient="to bottom right, rgba(21, 101, 192, 0.97), rgba(25, 118, 210, 0.97)"
          height="100%"
        ></v-img>
      </template>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <v-container class="py-12">
        <!-- Enhanced Medical Disclaimer -->
        <v-alert
          color="info"
          variant="tonal"
          border="start"
          elevation="2"
          class="mb-8"
        >
          <template v-slot:prepend>
            <v-avatar color="info" size="48">
              <v-icon icon="mdi-shield-check" size="24"></v-icon>
            </v-avatar>
          </template>
          <div class="d-flex flex-column">
            <span class="text-h6 mb-1">Medical Professional Use Only</span>
            <span class="text-body-2">This AI-assisted diagnostic tool is designed to supplement, not replace, professional medical judgment. Always verify results with standard clinical procedures.</span>
          </div>
        </v-alert>

        <!-- Enhanced Feature Cards -->
        <v-row class="mb-8">
    <v-col
      v-for="(feature, index) in features"
      :key="index"
      cols="12"
      md="4"
    >
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          :elevation="isHovering ? 8 : 2"
          class="h-100 rounded-lg professional-card"
        >
          <v-card-item class="pa-4">
            <v-avatar
              :color="feature.color"
              size="48"
              class="mb-3"
            >
              <v-icon
                :icon="feature.icon"
                size="24"
                color="white"
              ></v-icon>
            </v-avatar>
            <v-card-title class="text-h6 mb-1">{{ feature.title }}</v-card-title>
            <v-card-text class="text-body-2">{{ feature.description }}</v-card-text>
            <v-card-text class="text-caption text-primary pt-0">
              {{ feature.stat }}
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>

        <v-row>
          <!-- Enhanced Upload Section -->
          <v-col cols="12" lg="6">
            <v-card elevation="2" class="rounded-lg">
              <v-card-item class="bg-primary">
                <template v-slot:prepend>
                  <v-avatar color="white" size="48">
                    <v-icon color="primary" icon="mdi-cloud-upload" size="24"></v-icon>
                  </v-avatar>
                </template>
                <v-card-title class="text-white text-h5">Upload X-ray Image</v-card-title>
                <v-card-subtitle class="text-white mt-1">
                  Supported formats: DICOM, JPG, PNG
                </v-card-subtitle>
              </v-card-item>

              <v-card-text class="pa-6">
                <v-file-input
                  v-model="selectedFile"
                  accept="image/*"
                  placeholder="Drag and drop or click to upload"
                  :rules="uploadRules"
                  prepend-icon=""
                  :loading="isLoading"
                  @change="onFileChange"
                  :error-messages="errorMessage"
                  show-size
                  variant="outlined"
                  class="mb-6"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary" icon="mdi-image"></v-icon>
                  </template>
                </v-file-input>

                <v-btn
                  block
                  color="primary"
                  size="large"
                  :disabled="!selectedFile || isLoading"
                  :loading="isLoading"
                  @click="submitImage"
                  class="text-h6 py-6"
                  elevation="2"
                >
                  <v-icon start icon="mdi-magnify" class="me-2"></v-icon>
                  {{ isLoading ? 'Analyzing...' : 'Analyze Image' }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Enhanced Results Section -->
          <v-col cols="12" lg="6">
            <v-card elevation="2" class="rounded-lg">
              <v-card-item class="bg-primary">
                <template v-slot:prepend>
                  <v-avatar color="white" size="48">
                    <v-icon color="primary" icon="mdi-file-document" size="24"></v-icon>
                  </v-avatar>
                </template>
                <v-card-title class="text-white text-h5">Analysis Results</v-card-title>
                <v-card-subtitle class="text-white mt-1">
                  AI-powered diagnostic suggestions
                </v-card-subtitle>
              </v-card-item>

              <v-card-text class="pa-6">
                <v-fade-transition>
                  <div v-if="imageUrl" class="mb-6">
                    <v-img
                      :src="imageUrl"
                      :aspect-ratio="4/3"
                      cover
                      class="rounded-lg"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </div>
                </v-fade-transition>

                <v-expand-transition>
                  <div v-if="prediction" class="mt-4">
                    <div class="d-flex align-center mb-4">
                      <v-icon icon="mdi-clipboard-pulse" color="primary" size="24" class="me-2"></v-icon>
                      <span class="text-h6">Detected Conditions</span>
                    </div>
                    
                    <v-list class="rounded-lg">
                      <v-slide-y-transition group>
                        <v-list-item
                          v-for="(prob, index) in prediction"
                          :key="index"
                          :class="getConfidenceClass(prob.probability)"
                          class="mb-3 rounded"
                        >
                          <template v-slot:prepend>
                            <v-avatar :color="getConfidenceColor(prob.probability)" size="40">
                              <v-icon color="white" icon="mdi-check-circle"></v-icon>
                            </v-avatar>
                          </template>
                          
                          <v-list-item-title class="text-h6 mb-1">
                            {{ prob.condition }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Confidence: {{ (prob.probability * 100).toFixed(1) }}%
                          </v-list-item-subtitle>
                          
                          <template v-slot:append>
                            <v-progress-circular
                              :model-value="prob.probability * 100"
                              :color="getConfidenceColor(prob.probability)"
                              size="40"
                            ></v-progress-circular>
                          </template>
                        </v-list-item>
                      </v-slide-y-transition>
                    </v-list>
                  </div>
                </v-expand-transition>

                <v-fade-transition>
                  <div
                    v-if="!imageUrl && !prediction"
                    class="d-flex flex-column align-center py-12"
                  >
                    <v-icon
                      icon="mdi-image-outline"
                      size="64"
                      color="grey-lighten-1"
                      class="mb-4"
                    ></v-icon>
                    <span class="text-h6 text-medium-emphasis">No Image Analyzed</span>
                    <span class="text-body-2 text-medium-emphasis">Upload an X-ray image to begin analysis</span>
                  </div>
                </v-fade-transition>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Enhanced Footer -->
    <v-footer class="bg-primary">
      <v-container>
        <v-row justify="space-between" align="center" class="py-4">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <span class="text-caption text-white">
              © {{ new Date().getFullYear() }} BachSamadhiSora. All rights reserved.
            </span>
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <v-btn
              v-for="link in footerLinks"
              :key="link.text"
              variant="text"
              class="text-white text-caption mx-2"
            >
              {{ link.text }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
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
          icon: 'mdi-brain',
          color: 'primary',
          title: 'AI Analysis',
          description: 'State-of-the-art deep learning models trained on over 1 million medical images',
          stat: '99.8% accuracy on validation sets'
        },
        {
          icon: 'mdi-file-certificate',
          color: 'success',
          title: 'Clinical Reports',
          description: 'Comprehensive analysis with detailed probability scores and recommendations',
          stat: 'Trusted by 500+ medical institutions'
        },
        {
          icon: 'mdi-shield-check',
          color: 'info',
          title: 'Medical Grade',
          description: 'FDA-approved and HIPAA-compliant platform for clinical use',
          stat: 'ISO 27001 certified security'
        }
      ],
      footerLinks: [
        { text: 'Privacy Policy' },
        { text: 'Terms of Service' },
        { text: 'Contact Support' }
      ],
    }
  },

  methods: {
    async submitImage() {
      if (!this.selectedFile) return;

      this.isLoading = true;
      this.errorMessage = null;
      
      // Simulated API call
      setTimeout(() => {
        this.prediction = [
          { condition: "Pneumonia", probability: 0.82 },
          { condition: "Cardiomegaly", probability: 0.15 },
          { condition: "Emphysema", probability: 0.03 }
        ];
        this.isLoading = false;
      }, 2000);
    },

    getConfidenceColor(probability) {
      if (probability >= 0.7) return 'success';
      if (probability >= 0.4) return 'warning';
      return 'error';
    },

    getConfidenceClass(probability) {
      if (probability >= 0.7) return 'bg-success-lighten-5';
      if (probability >= 0.4) return 'bg-warning-lighten-5';
      return 'bg-error-lighten-5';
    },

    onFileChange(event) {
      // Clear previous image URL if it exists
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = null;
      }

      // Check if we have a valid file
      if (event && event.length > 0) {
        const file = event[0];
        // Only proceed if it's an image file
        if (file.type.startsWith('image/')) {
          this.imageUrl = URL.createObjectURL(file);
        } else {
          this.errorMessage = 'Please upload a valid image file';
        }
      }
    },

    // Clean up any object URLs when component is destroyed
    beforeUnmount() {
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl);
      }
    }
}
};
</script>

<style>
.professional-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.professional-card:hover {
  border-color: var(--v-primary-base);
}

.v-list-item {
  transition: all 0.3s ease;
}

.v-card-item {
  position: relative;
}

.bg-success-lighten-5 {
  background-color: rgb(237, 247, 237) !important;
}

.bg-warning-lighten-5 {
  background-color: rgb(255, 248, 225) !important;
}

.bg-error-lighten-5 {
  background-color: rgb(255, 235, 238) !important;
}

/* Smooth transitions */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.5s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}
</style>