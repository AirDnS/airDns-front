<template>
  <v-card flat class="w-100 h-100">
    <v-card-text>
      <div class="d-sm-flex align-center">
        <div>
          <h2 class="title text-h6 font-weight-medium">방 목록</h2>
        </div>
      </div>
      <v-table fixed-header class="month-table mt-7">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-no-wrap font-weight-medium text-subtitle-1 text-center">Id</th>
              <th class="text-no-wrap font-weight-medium text-subtitle-1">방 이름</th>
              <th class="text-no-wrap font-weight-medium text-subtitle-1">설명</th>
              <th class="text-no-wrap font-weight-medium text-subtitle-1 text-end">가격</th>
              <th class="text-no-wrap font-weight-medium text-subtitle-1 text-end">크기</th>
              <th class="text-no-wrap font-weight-medium text-subtitle-1 text-center">상태</th>
              <th class="icon-column"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="table?.length == 0">
              <td colspan="7" class="text-center"> 데이터가 없습니다.</td>
            </tr>
            <tr
              v-for="item in table"
              :key="item.roomsId"
              :class="item.activestate"
              class="month-item"
            >
              <td class="text-center">{{ item.roomsId }}</td>
              <td style="min-width: 200px;">
                <h4 class="font-weight-bold">
                  {{ item.name }}
                </h4>
                <h6
                  class="
                    font-weight-regular
                    text-body-2 text-grey-darken-1
                  "
                >
                  {{ item.address }}
                </h6>
              </td>
              <td>
                <h5
                  class="
                    font-weight-medium
                    text-body-2 text-grey-darken-1
                  "
                >
                  {{ item.desc }}
                </h5>
              </td>
              <td>
                <h5
                  class="
                    font-weight-medium
                    text-no-wrap text-body-2 text-grey-darken-1
                    text-end
                  "
                >
                  {{ item.price }}
                </h5>
              </td>
              <td>
                <h5
                  class="
                    font-weight-medium
                    text-no-wrap text-body-2 text-grey-darken-1
                    text-end
                  "
                >
                {{ item.size }}
                </h5>
              </td>
              <td class="text-center">
                <v-chip
                  class="ma-2"
                  :color="item.statuscolor"
                  size="small"
                  label
                  >
                {{ item.status }}
                </v-chip>
              </td>
              <td class="icon-column">
                <v-menu location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi mdi-dots-horizontal" variant="plain" size="x-small" v-bind="props"></v-btn>
                  </template>
                  <v-list density="compact" min-width="160">
                    <v-list-item @click="goRoomEdit(item.roomsId)">
                      <template v-slot:prepend><v-icon end icon="mdi mdi-pencil" size="small"></v-icon></template>
                      <v-list-item-title class="font-weight-medium text-no-wrap text-body-2 text-grey-darken-3">방 관리</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="goRoomPage(item.roomsId)">
                      <template v-slot:prepend><v-icon end icon="mdi mdi-arrow-right-bold-outline" size="small"></v-icon></template>
                      <v-list-item-title class="font-weight-medium text-no-wrap text-body-2 text-grey-darken-3">바로가기</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteRoom(item.roomsId)">
                      <template v-slot:prepend><v-icon end icon="mdi mdi-delete" size="small"></v-icon></template>
                      <v-list-item-title class="font-weight-medium text-no-wrap text-body-2 text-grey-darken-3">삭제</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </template>
        
      </v-table>
			<v-pagination class="pagination mb-2 mt-6" size="small" v-model="page.pageNumber" :length="page.totalPages" @update:modelValue="getRoomList"></v-pagination>
    </v-card-text>
  </v-card>
</template>
<script>
import axios from '@/axios';
import router from "@/routers";

export default {
  data() {
    return {
      page: {
        pageNumber: 1,
        totalPages: 1,
      },
			table: []
    }
  },
  methods: {
    getRoomList: function () {

      axios.get(`/api/v1/rooms/host`, {
        withCredentials: true,
        params: {
          page: this.page.pageNumber - 1
        }})
          .then((result) => {
            this.table = result.data.data.content;
            this.page.pageNumber = result.data.data.pageable.pageNumber + 1;
            this.page.totalPages = result.data.data.totalPages;
            
            console.log(this.table);

            this.table.forEach(element => {
              if (element.isClosed == true) {
                element.status = "비활성";
                element.statuscolor = "disable";
              } else {
                element.status = "활성";
                element.statuscolor = "info";
              }
            });
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            console.log("test");
          })
    },
    goRoomEdit(roomsId) {
      router.push({
        name: 'EditRoom',
        state: {
          data: roomsId,
        }
      })
    },
    goRoomPage(roomsId) {
      const routeData = router.resolve({
          name: 'RoomDetail',
          params: {
            roomsId: roomsId
          }
        })
      window.open(routeData.href, '_blank');
    },
    deleteRoom(roomsId) {
      this.$swal.fire({
        title: "정말 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "네",
        cancelButtonText: "아니오"
      }).then((swalResult) => {
        if (swalResult.isConfirmed) {
          axios.delete(`/api/v1/rooms/` + roomsId,  {withCredentials: true})
            .then((result) => {
              this.$swal.fire({
                title: "삭제되었습니다!",
                icon: "success"
              });
              console.log( result.data.message );
              this.getRoomList();
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
            })
        }
      });
    }
  },
  mounted() {
    this.getRoomList();
  },

}

</script>

<style scoped>
.icon-column {
    text-align: center;
    min-width: 60px;
}
</style>